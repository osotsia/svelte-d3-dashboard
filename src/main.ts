import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

const target = document.getElementById('app');

if (!target) {
  throw new Error("Application target element #app not found in the DOM.");
}

const app = mount(App, {
  target: target,
})

export default app