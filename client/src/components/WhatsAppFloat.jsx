export default function WhatsAppFloat() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '91XXXXXXXXXX';
  return (
    <div className="whatsapp-float">
      <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="Chat on WhatsApp">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <span className="wa-tooltip">Chat with us</span>
    </div>
  );
}
