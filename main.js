import "./style.css";
import Router, { Menu } from "./src/utils/router.js";

window.addEventListener("DOMContentLoaded", () => {
  Router.init();
  Menu.load();
});
