import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

function Contact() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="border-t border-stone-900 pb-5">
      <h2 className="my-5 text-center text-slate-900 text-4xl">Get in Touch</h2>
      <div className="text-center text-slate-900 tracking-tighter flex flex-col items-center">
        <p className="my-4 flex items-center">
          <FaLocationDot className="text-[#FF4F4F] mr-2" />
          Barisal Sadar, Barisal, Bangladesh
        </p>
        <a
          href={`mailto:dev.mdsaifulislam@gmail.com`}
          className="my-4 flex items-center border-b"
        >
          <MdEmail className="text-[#2196F3] mr-2" />
          dev.mdsaifulislam@gmail.com
        </a>
        <p>&copy; {currentYear} Saif. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Contact;