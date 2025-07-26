import asyncio
import logging
from pathlib import Path
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from typing import Tuple
import easyocr
import fitz 
import numpy as np
from PIL import Image
import io

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Thread pool for CPU-bound tasks
thread_pool = ThreadPoolExecutor()

# List of supported languages
supported_languages = [
    'bn', 'ja', 'zh-cn', 'zh-tw', 'ko', 'ru', 'bg', 'be', 'uk',
    'cs', 'pl', 'sk', 'da', 'no', 'sv', 'nl', 'de', 'fr', 'it',
    'es', 'pt', 'en'
]

def run_in_thread_pool(fn, *args, **kwargs):
    """Run a function in the thread pool."""
    return asyncio.get_running_loop().run_in_executor(thread_pool, partial(fn, *args, **kwargs))

async def get_ocr_reader(lang: str):
    """Get an OCR reader for a specific language."""
    if lang not in supported_languages:
        logger.warning(f"Language '{lang}' not supported. Defaulting to English.")
        lang = 'en'
    return await run_in_thread_pool(easyocr.Reader, [lang, 'en'] if lang != 'en' else ['en'])

async def process_image(img_data, reader) -> str:
    """Process an image with OCR."""
    try:
        if isinstance(img_data, bytes):
            img = await run_in_thread_pool(Image.open, io.BytesIO(img_data))
        else:
            img = img_data

        img_np = np.array(img)
        ocr_result = await run_in_thread_pool(reader.readtext, img_np)

        # Check if ocr_result is a list of lists (expected format)
        if isinstance(ocr_result, list) and all(len(item) >= 2 for item in ocr_result):
            return ' '.join([text for _, text, *_ in ocr_result])
        else:
            logger.error(f"Unexpected OCR result format: {ocr_result}")
            return ""
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return ""

async def process_page(page, reader) -> str:
    """Process a PDF page with OCR."""
    try:
        # Extract text from the page
        text = await run_in_thread_pool(page.get_text)

        # Extract images from the page
        image_texts = []
        for img in page.get_images():
            xref = img[0]
            base_image = await run_in_thread_pool(page.parent.extract_image, xref)
            image_text = await process_image(base_image["image"], reader)
            image_texts.append(image_text)

        return text + ' ' + ' '.join(image_texts)
    except Exception as e:
        logger.error(f"Error processing page: {e}")
        return ""

async def pdf_to_text(pdf_path: Path, lang: str) -> Tuple[str, str]:
    """Convert a PDF file to text."""
    try:
        # Validate language
        if lang not in supported_languages:
            logger.warning(f"Language '{lang}' not supported. Defaulting to English.")
            lang = 'en'

        # Open the PDF document
        doc = await run_in_thread_pool(fitz.open, pdf_path)

        # Get OCR reader for provided language
        reader = await get_ocr_reader(lang)

        # Process all pages
        tasks = [process_page(page, reader) for page in doc]
        results = await asyncio.gather(*tasks)

        # Close the document
        await run_in_thread_pool(doc.close)

        return ' '.join(results), lang
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        return "", "en"

async def image_to_text(image_path: Path, lang: str) -> Tuple[str, str]:
    """Convert an image file to text."""
    try:
        # Validate language
        if lang not in supported_languages:
            logger.warning(f"Language '{lang}' not supported. Defaulting to English.")
            lang = 'en'

        # Open the image
        img = await run_in_thread_pool(Image.open, image_path)

        # Use the provided language
        reader = await get_ocr_reader(lang)
        text = await process_image(img, reader)

        return text, lang
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return "", "en"
