import { NOOP } from '@vue/shared'

import type { App, Directive } from 'vue'
import type { SFCInstallWithContext, SFCWithInstall } from './typescript'
// extends，代表E可以集成自Record，那么为什么不直接用Record表示呢？
export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    // ?? 
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }
  // main 和 extra 的关系？
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  // &是交叉类型，main同时是这2个类型，与之对应的是联合类型，用|表示，代表几种类型之一
  return main as SFCWithInstall<T> & E
}

export const withInstallFunction = <T>(fn: T, name: string) => {
  ;(fn as SFCWithInstall<T>).install = (app: App) => {
    ;(fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}

export const withInstallDirective = <T extends Directive>(
  directive: T,
  name: string
) => {
  ;(directive as SFCWithInstall<T>).install = (app: App): void => {
    app.directive(name, directive)
  }

  return directive as SFCWithInstall<T>
}

export const withNoopInstall = <T>(component: T) => {
  ;(component as SFCWithInstall<T>).install = NOOP

  return component as SFCWithInstall<T>
}
