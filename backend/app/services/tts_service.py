import asyncio
import logging
import uuid
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional
from TTS.api import TTS
from app.config import DEVICE, AUDIO_DIR

# Configure logging
logger = logging.getLogger(__name__)

# Thread pool for CPU-bound tasks
thread_pool = ThreadPoolExecutor()

# Mapping of languages to TTS models
lang_to_model = {       
    'en': 'tts_models/en/ljspeech/fast_pitch',
    'fr': 'tts_models/fr/mai/tacotron2-DDC',
    'de': 'tts_models/de/thorsten/tacotron2-DDC',
    'es': 'tts_models/es/mai/tacotron2-DDC',
    'it': 'tts_models/it/mai_female/glow-tts',
    'nl': 'tts_models/nl/mai/tacotron2-DDC',
    'pt': 'tts_models/pt/cv/vits',
    'pl': 'tts_models/pl/mai_female/vits',
    'tr': 'tts_models/tr/common-voice/glow-tts',
    'ja': 'tts_models/ja/kokoro/tacotron2-DDC',
    'zh-cn': 'tts_models/zh-CN/baker/tacotron2-DDC-GST',
    'bn': 'tts_models/bn/custom/vits-male',  
    'bg': 'tts_models/bg/cv/vits',
    'cs': 'tts_models/cs/cv/vits',
    'da': 'tts_models/da/cv/vits',
    'et': 'tts_models/et/cv/vits',
    'ga': 'tts_models/ga/cv/vits',
    'el': 'tts_models/el/cv/vits',
    'fi': 'tts_models/fi/css10/vits',
    'hr': 'tts_models/hr/cv/vits',
    'hu': 'tts_models/hu/css10/vits',
    'lt': 'tts_models/lt/cv/vits',
    'lv': 'tts_models/lv/cv/vits',
    'mt': 'tts_models/mt/cv/vits',
    'ro': 'tts_models/ro/cv/vits',
    'sk': 'tts_models/sk/cv/vits',
    'sl': 'tts_models/sl/cv/vits',
    'sv': 'tts_models/sv/cv/vits',
    'uk': 'tts_models/uk/mai/vits',
    'ca': 'tts_models/ca/custom/vits',
    'fa': 'tts_models/fa/custom/glow-tts',
    'be': 'tts_models/be/common-voice/glow-tts'
}

def run_in_thread_pool(fn, *args, **kwargs):
    """Run a function in the thread pool."""
    return asyncio.get_event_loop().run_in_executor(thread_pool, partial(fn, *args, **kwargs))

async def text_to_audio(
    text: str, 
    lang: str, 
    speaker: Optional[str] = None, 
    max_retries: int = 3, 
    retry_delay: int = 5
) -> Path:
    """Convert text to audio using TTS."""
    model_name = lang_to_model.get(lang, 'tts_models/multilingual/multi-dataset/your_tts')
    
    # Check if AUDIO_DIR exists, create if not
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    # Retry loop
    for attempt in range(max_retries):
        try:
            # Initialize TTS model
            tts = await run_in_thread_pool(lambda: TTS(model_name=model_name).to(DEVICE))
            
            # Generate unique filename
            output_file = AUDIO_DIR / f"Audio_{lang}_{uuid.uuid4()}.wav"
            
            # Generate audio
            await run_in_thread_pool(
                tts.tts_to_file, 
                text=text, 
                file_path=str(output_file), 
                speaker=speaker
            )
            
            return output_file
        except Exception as e:
            logger.warning(f"TTS attempt {attempt + 1} failed: {e}")
            
            # If not the last attempt, wait before retrying
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
            else:
                logger.error(f"Failed to generate audio after {max_retries} attempts")
                raise
