export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jean-Alphonse Bastos — All Rights Reserved
          </p>
          <p className="text-xs text-muted-foreground">
            ABSORBE™ — Godinje, Montenegro
          </p>
          <p className="text-xs text-muted-foreground">
            UNLMTD™ trademark
          </p>
        </div>
      </div>
    </footer>
  );
}
