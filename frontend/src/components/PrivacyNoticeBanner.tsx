import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { hasSeenPrivacyNotice, setPrivacyNoticeSeen } from "@/lib/privacyNoticeCookie";

export function PrivacyNoticeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenPrivacyNotice()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setPrivacyNoticeSeen();
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-sm">
      <div className="container-wide flex flex-col gap-3 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Utilizamos cookies técnicos e dados de navegação para operar o site e melhorar a sua experiência. Ao continuar
          a navegar, você concorda com essa utilização. Consulte a{" "}
          <Link to="/privacy" className="underline underline-offset-4 text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2 justify-end">
          <Button size="sm" onClick={handleAccept}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}

