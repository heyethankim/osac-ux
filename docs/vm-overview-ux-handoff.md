# VM Overview — UX handoff

Contact: Yifat Friman Menchik, UXD  
Google Doc: [VM Overview](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)  
Interactive mock: [VM Overview 0.5, Tenant Admin](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=0.5&role=admin&vm=indigo-quokka-89)

VM Overview shows the active instance type, CPU, and memory. Editing the instance type opens the name-first, two-line picker: each option has the resource name above CPU, memory, GPU count and readable model when present, and rate. Omit PCI hardware IDs from visible labels. The GPU specification still determines which resize targets are compatible. See the [resize handoff](osac-4281-vm-resize-handoff.md).

## Version 0.5 — configuration operations (OSAC-7158)

The Overview **Status** row shows the VM power state only. Keep active instance type, CPU, memory, and attached external IP as the main values. Place one configuration-operation alert above Overview. For a single operation, name the resize or external-IP attachment, its status, and its target instance type or IP. When operations overlap, use one alert with a bullet for each operation and its status; use danger styling if any operation failed. In progress copy says “Changing instance type to **large**” or “Attaching external IP **198.51.100.21**”; bold the target value without brackets. If a later attempt is known, put “Retry attempt: 2” on its own subdued line below that operation, without an assumed maximum. Show next-attempt time only when available; say no further retry is scheduled only when explicitly known. Do not expose raw errors or imply that a manual Retry action exists.

![Version 0.5 configuration operations with target values and retry metadata](screenshots/latest-ux/vm-config-operations-0.5.jpg)

When a resize requires a restart, a persistent **info** notification at the top says “Restart required to apply resize.” It is collapsed by default and expands to show current and requested values. The VM list retains its power status and adds a neutral **Resize scheduled** label with a restart tooltip. During application, show **Resize in progress** as a compact list label. Keep active values visible until completion.

The VM list uses compact PatternFly pagination in card and table views: an item-range dropdown plus Previous and Next above and below the results.

The screenshots below document the 0.4 layout. Use the 0.5 interactive mockup for the new operation alerts; refreshed 0.5 captures are pending.

![VM list and compact pagination](screenshots/latest-ux/vm-list.png)

![VM table with resize labels and compact pagination](screenshots/latest-ux/vm-table.png)

![Resize instance type menu](screenshots/latest-ux/resize-instance-types.png)

For access, networking, storage, utilization, failure states, and permissions, follow the [Google UX handoff](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit).
