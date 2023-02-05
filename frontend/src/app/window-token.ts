import {FactoryProvider, InjectionToken} from "@angular/core";

export const WINDOW = new InjectionToken('window');
const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};
export const WINDOW_PROVIDERS = [
  windowProvider
]
