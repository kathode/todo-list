export const createElement = (tag, attributes = {}, ...children) => {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }
  for (const child of children) {
    element.appendChild(child);
  }
  return element;
};

export const selectOptions = (options, currentSelection) => {
  const optionUI = [];

  for (const option of options) {
    optionUI.push(createElement("option", { ...option, selected: currentSelection === option.value }));
  }

  return optionUI;
};
