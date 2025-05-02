/**
 * Show or hide the Tawk.to widget iframe.
 * @param visible - true to show, false to hide
 */
export function setTawkWidgetVisible(visible: boolean) {
  const iframe = document.querySelector('iframe[title="chat widget"]') as HTMLIFrameElement | null;
  if (iframe) {
    iframe.style.display = visible ? '' : 'none';
  }
}