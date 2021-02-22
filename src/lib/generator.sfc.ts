import prettier from "prettier/esm/standalone.mjs";
import parserBabel from "prettier/esm/parser-babel.mjs";
import parserHtml from "prettier/esm/parser-html.mjs";
import { camelCase, isEmpty } from 'lodash'
import exportFile from "./exportFile";
export type SlotType = {
  name: string
  tag: string
  mainProp: string
  componentProps: Record<string, any>
}
type BuildContentType = {
  componentName?: string
  componentProps?: Record<string, any>,
  slots: SlotType[]
}
type AttrType = {
  key: string,
  value: any
}

export function generateCode({
  componentName = 'crud',
  componentProps = {},
  slots = [],
}: BuildContentType) {
  const buildTemplate = (
    componentTpl: string,
    {
      data = '',
      methods = ''
    }: Record<string, any> = {}) => {
    return `
    <template>
      <div class="page-container">
        ${componentTpl}
      </div>
    </template>
    <script>
    import Crud from '@/components/crud'
    export default {
      name: 'CrudPage',
      components: {
        Crud
      },
      data() {
        return { ${data} }
      },
      ${methods ? `methods: { ${methods} }` : '' }
    }
    </script>
  `
  }
  const buildComponent = (componentAttrStr: string, componentSlotStr: any = '') => {
    return `
    <${componentName} ${componentAttrStr}>
      ${componentSlotStr}
    </${componentName}>
    `
  }

  const buildScopedSlots = (tag: string, slotName: string, mainProp: string, componentProps: Record<string, any> = {}) => {
    let slotComponent = ''
    let attrs = Object.keys(componentProps).map(key => {
      const val = componentProps[key]
      if (typeof val === 'object') {
        return `:${key}='${JSON.stringify(val)}'`
      }
      if (typeof val === 'boolean' || typeof val === 'number') {
        return `:${key}="${val}"`
      }
      return `${key}='${val}'`
    }).join(' ')
    if (mainProp === '__slot__') {
      slotComponent = `<${tag} ${attrs}>{{ scope.row[${slotName}] }}</${tag}>`
    } else {
      attrs += Object.keys(componentProps).map(key => {
        return ` :${key}="scope.row.${slotName}"`
      }).join(' ')

      slotComponent = `<${tag} :${mainProp}="scope.row.${slotName}" ${attrs}></${tag}>`
    }
    if (tag === 'span' && isEmpty(componentProps)) return ''
    return `
    <template v-slot:${slotName}="{ scope }">
      ${slotComponent}
    </template>
    `
  }

  const attrs: AttrType[] = []
  const datas: AttrType[] = []
  /**
   * 处理组件的props
   * 需要将属性名添加到组件上，将属性值注册到data中
   */
  Object.keys(componentProps).forEach(key => {
    attrs.push({
      key: key,
      value: camelCase(`crud-${key}`)
    })

    datas.push({
      key: key,
      value: componentProps[key]
    })
  })

  const attrStr = attrs.map(item => {
    return `:${item.key}="${item.value}"`
  }).join(' ')

  const slotStr = slots.map(item => {
    return buildScopedSlots(item.tag, item.name, item.mainProp, item.componentProps)
  }).join('\n')
  const dataStr = datas.map(item => {
    return `${item.key}: ${JSON.stringify(item.value)},`
  }).join('\n')
  const res = buildTemplate(
    buildComponent(attrStr, slotStr),
    {
      data: dataStr,
      methods: ""
    }
  )
  const content = prettier.format(res, {
    parser: "vue",
    plugins: [parserBabel, parserHtml],
  });

  return content
}


export function generateSFC({
  componentName = 'crud',
  componentProps = {},
  slots = [],
}: BuildContentType) {
  const content = generateCode({
    componentName,
    componentProps,
    slots
  })

  exportFile({
    fileName: '',
    content
  })

  window.parent.postMessage({
    key: 'code',
    data: content
  }, '*')
}