# VM Overview — UX handoff

Contact: [Yifat Friman Menchik](mailto:yfrimanm@redhat.com), UXD
Google Doc: [VM Overview](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)  
OSAC-7158 Google Doc: [VM configuration operations](https://docs.google.com/document/d/1KkHVqjNJ4lZl40X8aE1v589jDd7ilAle9NnaV13DIr4/edit)
Interactive mocks: [0.4](https://osac-project.github.io/osac-ux/vmaas-ux-prototype-v0.4.html?v=c6c0274&role=admin&vm=indigo-quokka-89) · [0.5](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=deef415&role=admin&vm=indigo-quokka-89)

VM Overview shows the active instance type, CPU, and memory. Editing the instance type opens the name-first, two-line picker: each option has the resource name above CPU, memory, GPU count and readable model when present, and rate. Omit PCI hardware IDs from visible labels. The GPU specification still determines which resize targets are compatible. See the [resize handoff](osac-4281-vm-resize-handoff.md).

## Version 0.5 — configuration operations (OSAC-7158)

The current behavior, screenshots, retry wording, mixed-state precedence, and scheduled-resize actions are maintained in the [dedicated configuration operations handoff](osac-7158-configuration-operations.md). That handoff supersedes earlier operation screenshots and descriptions.

## Access and initial run examples

These 0.5 captures show Cloud-init and Windows Sysprep. The retry, attachment, detachment, and failure captures above reflect the latest External IP design.

![Inline Cloud-init value](screenshots/latest-ux/vm-overview-inline-0.5.png)

![Windows Sysprep](screenshots/latest-ux/vm-overview-windows-0.5.png)

## Storage table typography

Networking and Additional disks column headings use the standard PatternFly 6 table heading typography in both versions: 14px semibold Red Hat Text in the regular text color. The same treatment applies to other custom table headers.

![Version 0.4 Storage section](screenshots/latest-ux/vm-overview-storage-0.4.png)

![Version 0.5 Storage section](screenshots/latest-ux/vm-overview-storage-0.5.png)
