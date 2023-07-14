import { createContext, useContext } from "react";
import { getAPI } from "obsidian-dataview";
import { ReactRenderer } from "src/utils/ReactRenderer";

export interface ComponentContextProps{
  source: string;
  type: string;
  component: ReactRenderer
  getAPI: typeof getAPI
}

export const ComponentContext = createContext<ComponentContextProps>(undefined!);

export const useComponentContext = () => useContext(ComponentContext)