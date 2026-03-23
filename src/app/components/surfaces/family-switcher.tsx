/**
 * Family Surface Switcher
 *
 * Reads the familyVariation from outlet context and renders
 * the appropriate variation: A (Constellation), B (Journal), C (Command Center).
 * Falls back to the original FamilySurface if variation is unset.
 */

import { useOutletContext } from "react-router";
import type { FamilyVariation } from "../../layouts/root-layout";
import { FamilySurface as FamilySurfaceOriginal } from "./family-surface";
import { FamilyVariationA } from "./family-variation-a";
import { FamilyVariationB } from "./family-variation-b";
import { FamilyVariationC } from "./family-variation-c";

export function FamilySurfaceSwitcher() {
  const { familyVariation } = useOutletContext<{ familyVariation?: FamilyVariation }>();

  switch (familyVariation) {
    case "A":
      return <FamilyVariationA />;
    case "B":
      return <FamilyVariationB />;
    case "C":
      return <FamilyVariationC />;
    default:
      return <FamilySurfaceOriginal />;
  }
}
