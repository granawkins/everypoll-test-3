import mentatLogo from '/mentat.png';

const Header = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '70px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
      }}
    >
      <a 
        href="https://mentat.ai" 
        target="_blank"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        <img 
          src={mentatLogo} 
          alt="Mentat logo" 
          style={{
            height: '40px',
            width: 'auto',
          }}
        />
      </a>
    </header>
  );
};

export default Header;
