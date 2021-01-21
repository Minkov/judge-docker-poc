export default function handle(element, onSubmit) {
    element.addEventListener('submit', (ev) => {
        ev.preventDefault();
        new FormData(ev.target);
    });

    element.addEventListener('formdata', (ev) => {
        onSubmit([...ev.formData.entries()].reduce((p, [k, v]) => Object.assign(p, {[k]: v}), {}));
    });
}