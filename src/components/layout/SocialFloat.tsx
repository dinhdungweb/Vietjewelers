import { Instagram } from 'lucide-react';

export default function SocialFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://zalo.me/3752213412889536069"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Chat on Zalo"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.18-.432-.72-.72-1.296-.72-.72 0-1.296.432-1.584.936-.288-.504-.864-.936-1.584-.936-.576 0-1.116.288-1.296.72-.36.864.504 2.016 2.88 3.456 2.376-1.44 3.24-2.592 2.88-3.456zM6.24 16.08c2.736 0 4.32-1.584 4.32-3.312 0-1.44-.864-2.16-1.728-2.592.576-.36.936-.936.936-1.584 0-1.296-1.296-2.016-2.88-2.016-1.008 0-2.16.36-2.88.864l.72 1.296c.504-.36 1.152-.576 1.728-.576.72 0 1.152.288 1.152.72 0 .504-.504.792-1.296.792H5.52v1.44h.936c.936 0 1.512.36 1.512.936 0 .576-.576 1.08-1.728 1.08-.72 0-1.584-.288-2.16-.72l-.72 1.368c.792.576 1.872.864 2.88.864z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/vietjewelers"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Follow on Instagram"
      >
        <Instagram className="w-6 h-6" />
      </a>
    </div>
  );
}
