import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  onError: (error: Error) => void;
  /** Changing this key resets the boundary (e.g. a new model URL). */
  resetKey: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
  resetKey: string;
}

/** Catches model loading/parsing failures thrown inside the R3F tree. */
export class ViewerErrorBoundary extends Component<Props, State> {
  override state: State = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  override componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError(error);
  }

  override render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
