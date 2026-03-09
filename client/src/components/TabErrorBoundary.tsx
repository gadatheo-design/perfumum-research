import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabErrorBoundaryProps {
  children: React.ReactNode;
  tabLabel?: string;
}

interface TabErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary isolé par onglet.
 * Capture les erreurs de rendu React dans un onglet sans faire crasher toute la page.
 */
export class TabErrorBoundary extends React.Component<TabErrorBoundaryProps, TabErrorBoundaryState> {
  constructor(props: TabErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): TabErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[TabErrorBoundary] Erreur dans l'onglet "${this.props.tabLabel ?? "inconnu"}":`, error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-1">
              Erreur dans l'onglet {this.props.tabLabel ? `« ${this.props.tabLabel} »` : ""}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Une erreur inattendue s'est produite lors du chargement de cet onglet.
              Les autres onglets restent accessibles.
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                {this.state.error.message}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={this.handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
