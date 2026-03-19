export default function FloatingChat() {
  return (
    <div
      className="fixed z-40 flex flex-col items-end"
      style={{ bottom: '3%', right: '1%', gap: '10px' }}
    >
      {/* Zalo */}
      <a
        href="https://zalo.me/3752213412889536069"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on Zalo"
        className="block hover:scale-110 transition-transform"
      >
        <img
          src="https://megamind-chat-buttons.s3.amazonaws.com/production/0ad7c8-f1.myshopify.com/btn-zalo-vietjewelers-2826.png"
          alt="Zalo"
          className="rounded-[10%]"
          style={{ width: '56px', height: '56px' }}
        />
      </a>
      {/* Instagram */}
      <a
        href="https://www.instagram.com/vietjewelers"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="block hover:scale-110 transition-transform"
      >
        <img
          src="https://megamind-chat-buttons.s3.amazonaws.com/production/0ad7c8-f1.myshopify.com/btn-instagram-vietjewelers-ZXv1.png"
          alt="Instagram"
          className="rounded-[10%]"
          style={{ width: '56px', height: '56px' }}
        />
      </a>
      {/* Facebook Messenger */}
      <a
        href="https://www.facebook.com/vietjewelers"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook Messenger"
        className="block hover:scale-110 transition-transform"
      >
        <img
          src="https://megamind-chat-buttons.s3.amazonaws.com/production/0ad7c8-f1.myshopify.com/btn-messenger-vietjewelers-JTzb.png"
          alt="Messenger"
          className="rounded-[10%]"
          style={{ width: '56px', height: '56px' }}
        />
      </a>
    </div>
  );
}
