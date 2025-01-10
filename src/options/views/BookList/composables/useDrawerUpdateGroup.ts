import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TRecordGroup } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { clone } from '~/logic/clone'
import { storageGroupList } from '~/logic/storage'

type TType = 'edit' | 'add'

const rules = {
  name: [{ required: true, message: '请输入组名', trigger: 'change' }],
  list: [{ required: true, message: '请添加组内单词', trigger: 'change' }],
} satisfies Record<keyof TRecordGroup, Rule[]>

export function useDrawerUpdateGroup() {
  const open = ref(false)
  const type = ref<TType>()
  const groupList = computed(() => storageGroupList.value)
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TRecordGroup>({
    name: '',
    list: [],
  })
  const isNameDuplication = computed(() => storageGroupList.value.some(group => formState.name === group.name))
  const { message } = App.useApp()

  function handleReset() {
    formState.name = ''
    formState.list = []
  }

  async function handleSave() {
    await formRef.value?.validate()

    if (isNameDuplication.value) {
      message.warning('不允许添加重复的组名')
      return
    }

    if (type.value === 'add') {
      storageGroupList.value.push(clone(formState))
      open.value = false
      handleReset()
      message.success('添加成功')
      return
    }

    if (type.value === 'edit') {
      message.success('编辑成功')
    }
  }

  function handleOpen(params: { type: TType } = { type: 'add' }) {
    open.value = true
    type.value = params.type
  }

  return {
    open,
    type,
    rules,
    groupList,
    formRef,
    formState,

    handleOpen,
    handleSave,
  }
}
