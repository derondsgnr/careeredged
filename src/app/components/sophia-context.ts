/**
 * Sophia Context — shared across RoleShell, TaskRoom, EdgePath, and any
 * descendant component that needs to open Sophia with a pre-loaded query.
 *
 * Exported separately so TaskRoom (which has its own layout, no RoleShell)
 * can also provide and consume the context without circular imports.
 */

import { createContext, useContext } from "react";

export interface SophiaCtxValue {
  /** Open Sophia panel with an optional pre-loaded message */
  openSophia: (message?: string) => void;
  /** Open Sophia voice overlay */
  openVoice: () => void;
}

export const SophiaCtx = createContext<SophiaCtxValue>({
  openSophia: () => {},
  openVoice: () => {},
});

export function useSophia(): SophiaCtxValue {
  return useContext(SophiaCtx);
}
