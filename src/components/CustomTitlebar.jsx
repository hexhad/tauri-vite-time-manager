import "./styles/custom-title.scss";
import { getCurrentWindow } from "@tauri-apps/api/window";
const CustomTitlebar = () => {
  const current = getCurrentWindow();

  const handleClose = async () => {
    await current.close();
  };

  const handleMinimize = async () => {
    await current.minimize();
  };

  return (
    <div data-tauri-drag-region class="titlebar">
      <button
        class="titlebar-button-close"
        id="titlebar-close"
        onClick={handleClose}
      ></button>
      <button
        class="titlebar-button-minimize"
        id="titlebar-minimize"
        onClick={handleMinimize}
      ></button>
    </div>
  );
};

export default CustomTitlebar;
