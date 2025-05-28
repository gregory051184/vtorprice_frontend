import { createEffect } from "effector";
import Router from "next/router";


const pushFx = createEffect<string, void>({
  handler: (url)=>{
    Router.push(url)
  }
})

const replaceFx = createEffect<string, void>({
  handler: (url)=>{
    Router.replace(url)
  }
})

const reloadFx = createEffect<void, void>({
  handler: ()=>{
    Router.reload()
  }
})

export const router = {
  pushFx,
  reloadFx,
  replaceFx
}
