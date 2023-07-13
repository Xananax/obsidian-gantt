import { Component } from "obsidian";
import { createContext, useContext } from "react";
import { getAPI } from "obsidian-dataview";

export interface ComponentContextProps{
  source: string;
  type: string;
  component: Component
  getAPI: typeof getAPI
}

export const ComponentContext = createContext<ComponentContextProps>(undefined!);

export const useComponentContext = () => useContext(ComponentContext)