import { defineStore } from 'pinia';

// 定义 store
export const useCodeStore = defineStore('code', {
  state: () => ({
    code: '',
    examId: '',
    problemSetId: '',
    problemSetProblemId: '',
    lollipop: '',
    compiler: 'GCC',
    url: '',
    isSubmitting: false,
    submitResult: null,
  }),
  actions: {
    setCode(code) {
      this.code = code;
    },
    setExamId(examId) {
      this.examId = examId;
    },
    setProblemSetId(problemSetId) {
      this.problemSetId = problemSetId;
    },
    setProblemSetProblemId(problemSetProblemId) {
      this.problemSetProblemId = problemSetProblemId;
    },
    setLollipop(lollipop) {
      this.lollipop = lollipop;
    },
    setCompiler(compiler) {
      this.compiler = compiler;
    },
    setUrl(url) {
      this.url = url;
    },
    setSubmitting(status) {
      this.isSubmitting = status;
    },
    setSubmitResult(result) {
      this.submitResult = result;
    },
  },
  persist: {
    storage: {
      getItem: async (key) => {
        return new Promise((resolve) => {
          chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
          });
        });
      },
      setItem: async (key, value) => {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, resolve);
        });
      },
      removeItem: async (key) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove(key, resolve);
        });
      },
    },
  },
});