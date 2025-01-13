import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TRecordGroup } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { clone } from '~/logic/clone'
import { storageGroupList } from '~/logic/storage'

type TType = 'edit' | 'add'

const rules = {
  name: [{ required: true, message: '请输入组名', trigger: 'change' }],
  list: [{ required: true, message: '请添加组内单词', trigger: 'change' }],
} satisfies Record<keyof Omit<TRecordGroup, 'uuid'>, Rule[]>

export function useDrawerUpdateGroup() {
  const open = ref(false)
  const type = ref<TType>()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TRecordGroup>({
    uuid: '',
    name: '',
    list: [],
  })
  const { message } = App.useApp()

  function handleReset() {
    formState.uuid = ''
    formState.name = ''
    formState.list = []
  }

  async function handleSave() {
    await formRef.value?.validate()
    const groupList = storageGroupList.value

    const isNameDuplication = groupList.some(group => formState.name === group.name)
    if (isNameDuplication) {
      message.warning('不允许添加重复的组名')
      return
    }

    try {
      if (type.value === 'add') {
        groupList.push(clone(formState))
        message.success('添加成功')
      }

      if (type.value === 'edit') {
        for (let i = 0; i < groupList.length; i++) {
          if (groupList[i].uuid === formState.uuid) {
            groupList[i].name = formState.name
            break
          }
        }

        message.success('编辑成功')
      }
    }
    finally {
      open.value = false
      handleReset()
    }
  }

  function handleOpen(group?: TRecordGroup) {
    if (group) {
      const isUUID = uuidValidate(group.uuid)
      if (!isUUID) {
        message.error('目标对象是错误的 UUID')
        return
      }

      type.value = 'edit'
      formState.uuid = group.uuid
      formState.name = group.name
      formState.list = clone(group.list)
    }
    else {
      type.value = 'add'
      formState.uuid = uuidv4()
    }

    open.value = true
  }

  return {
    open,
    type,
    rules,
    formRef,
    formState,

    handleOpen,
    handleSave,
  }
}
