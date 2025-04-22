import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TRecordWord } from '~/storage'
import { App } from 'ant-design-vue'
import { regexIsWord } from '~/constant/regex'
import { storageGroupList, storageWordList } from '~/storage'
import { clone } from '~/utils/clone'

type TType = 'edit' | 'add'

async function validatorIsWord(_: Rule, value: TRecordWord['word']) {
  if (value && regexIsWord.test(value) === false) {
    return Promise.reject(new Error('Please enter the English word'))
  }
  else {
    return Promise.resolve()
  }
}

const rules = {
  word: [{ required: true, message: 'Please enter the word', trigger: 'change' }, { validator: validatorIsWord }],
} satisfies Record<keyof Pick<TRecordWord, 'word'>, Rule[]>

export function useDrawerUpdateWord() {
  const { message } = App.useApp()
  const open = ref(false)
  const type = ref<TType>()
  const formRef = ref<FormInstance | null>(null)
  const record = ref<TRecordWord>()
  const formState = reactive<Partial<TRecordWord>>({
    word: void 0,
    groupUUID: void 0,
  })

  function handleReset() {
    formState.word = void 0
    formState.groupUUID = void 0
  }

  async function handleSave() {
    await formRef.value?.validate()

    try {
      if (type.value === 'add') {
        // add word
        storageWordList.value.push({
          word: formState.word!,
          groupUUID: formState.groupUUID,
        })

        // add group
        if (formState.groupUUID) {
          storageGroupList.value.forEach((item) => {
            if (item.uuid === formState.groupUUID) {
              item.list.push({
                word: formState.word!,
                groupUUID: formState.groupUUID,
              })
            }
          })
        }

        message.success('Add successfully!')
      }

      if (type.value === 'edit' && record.value) {
        // update word
        storageWordList.value.forEach((item) => {
          if (item.word === formState.word) {
            item.groupUUID = formState.groupUUID
          }
        })

        // update group
        if (record.value.groupUUID !== formState.groupUUID) {
          storageGroupList.value.forEach(({ uuid, list }) => {
            // remove old
            if (uuid === record.value!.groupUUID) {
              list.forEach(({ word }, index) => {
                if (word === record.value!.word) {
                  list.splice(index, 1)
                }
              })
            }

            // add new
            if (uuid === formState.groupUUID) {
              list.push({
                word: formState.word!,
                groupUUID: formState.groupUUID,
              })
            }
          })
        }

        message.success('Edit successfully!')
      }
    }
    finally {
      open.value = false
      handleReset()
    }
  }

  function handleOpen(_record?: TRecordWord) {
    if (_record) {
      type.value = 'edit'
      formState.word = _record.word
      formState.groupUUID = _record.groupUUID
      record.value = clone(_record)
    }
    else {
      type.value = 'add'
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
