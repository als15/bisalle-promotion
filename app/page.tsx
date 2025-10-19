import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/chocolate-balls-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(48, 24, 180, 0.9) 0%, rgba(68, 205, 170, 0.85) 100%)',
          backdropFilter: 'blur(3px)'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Image
          src="/logo.svg"
          alt="ביסַלֶה"
          width={400}
          height={200}
          style={{ filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.5))' }}
        />
      </div>
    </div>
  );
}
