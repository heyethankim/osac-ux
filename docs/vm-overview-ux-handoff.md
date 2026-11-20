# VM Overview — UX handoff

Contact: [Yifat Friman Menchik](mailto:yfrimanm@redhat.com), UXD
Google Doc: [VM Overview](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)  
OSAC-7158 Google Doc: [VM configuration operations](https://docs.google.com/document/d/1KkHVqjNJ4lZl40X8aE1v589jDd7ilAle9NnaV13DIr4/edit)
Interactive mocks: [0.4](https://osac-project.github.io/osac-ux/vmaas-ux-prototype-v0.4.html?v=c6c0274&role=admin&vm=indigo-quokka-89) · [0.5](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=indigo-quokka-89)

VM Overview shows the active instance type, CPU, and memory. Editing the instance type opens the name-first, two-line picker: each option has the resource name above CPU, memory, GPU count and readable model when present, and rate. Omit PCI hardware IDs from visible labels. The GPU specification still determines which resize targets are compatible. See the [resize handoff](osac-4281-vm-resize-handoff.md).

## Version 0.5 — configuration operations (OSAC-7158)

The Overview **Status** row shows the VM power state only. Keep active instance type, CPU, memory, and attached external IP as the main values. Keep the instance type name, CPU, memory, and GPU together. **Instance type** and **External IP** share one pattern: a spinner beside the heading only while an attempt runs, the current value, and a short status line naming the requested target from the first attempt onward. On the first attempt, the line is plain text. Make it clickable only when a retry has extra details to show, such as a supplied attempt number or safe previous failure reason; then it opens a keyboard-accessible popover. The spinner itself is not interactive; no purple information icon is needed. Name an attached address **Current external IP** and an address being attached **requested external IP**. Keep Attach external IP visible but disabled while attachment runs or an automatic retry is scheduled. A scheduled retry has no spinner and no top danger alert. Use one top danger alert for final failures; when two operations fail, list both in one alert. Put the failure reason and **Resize again** action in that alert, without repeating the failure below Instance type. **Resize again** opens the resize dialog with the failed target selected for review; it never silently resubmits. Manual actions remain unavailable while an automatic retry is scheduled. After attachment finally fails, keep the attempted address out of the attached-IP value and offer **Attach external IP** to start another selection.

![Version 0.5 matching Instance type and External IP progress](screenshots/latest-ux/vm-config-aligned-progress-0.5-crop.png)

The [scheduled-retry example](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=rhel-retry-cedar-29) keeps both targets in context, disables competing actions, and omits spinners until the next attempt begins.

![Version 0.5 scheduled retry without active spinners](screenshots/latest-ux/vm-config-retry-scheduled-0.5-crop.png)

The [ubuntu-copper-ibis-31 example](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=ubuntu-copper-ibis-31) combines a failed resize with external-IP attachment still running. The top alert covers the resize failure and offers **Resize again**; IP progress and its disabled Attach button stay beside External IP. In lists and cards, **Changes need attention** takes precedence, while the popover names both operations.

![Version 0.5 failed resize and active external-IP attachment](screenshots/latest-ux/vm-config-mixed-0.5.png)

![Version 0.5 mixed-operation status popover](screenshots/latest-ux/vm-config-status-popover-concurrent-0.5-crop.png)

### Simultaneous changes

Each operation keeps its own state on VM Overview: progress appears beside the Instance type or External IP heading, while the status line below names the requested target. The line opens details only when extra retry information is available. Only final failures appear in the top alert. If several operations fail, use one alert with a bullet for each failure. Keep **Resize again** in the alert and offer the external-IP selection action beside External IP when available. Keep current values visible until each change succeeds.

The VM list and cards still show one configuration line below the power status. Choose its text by priority: **Changes need attention** if any operation has finally failed with no automatic retry planned; otherwise **Changes in progress** if any attempt is running; otherwise **Changes pending** if a retry is scheduled or a change waits for restart. A scheduled retry is pending, not in progress. Activating the line opens a keyboard-accessible popover with a separate bullet for each outstanding operation and target, so the summary does not hide concurrent work. If any operation has finally failed, add an **Open VM details** button below the list. Do not suggest another manual attempt while an automatic retry is scheduled or running. Remove each operation from the popover when it completes, and remove the configuration line when none remain.

Use three plain-language states for each operation in Details and the list/card popover. **Retry scheduled: [target action]** means a previous attempt failed and the service explicitly plans another; show no spinner and disable competing manual actions. **Trying again: [target action]** means that retry is actively running; show a spinner and keep manual actions disabled. **Couldn't apply change to [target]** means the operation finally failed and no automatic retry is planned; show the top failure alert and allow a manual attempt from VM Details. A first attempt can still say **Changing** or **Attaching**. The list/card popover adds an **Open VM details** button only for a final failure. An attempt count or failure reason alone does not establish that another retry is coming.

When the service supplies a safe reason for the preceding failure, show **Previous attempt failed: [reason]** in the operation popover. Show a retry attempt number only while that retry runs and only when supplied. If the service reports a known prerequisite that blocks a change, explain it in plain language in both places. Do not invent a blocker, reason, attempt count, or ETA. Keep **Stopped** as a power state, not a configuration failure. After success, update the active value, remove the outstanding status, and show a brief success toast; do not retain a Completed line.

For example, [fedora-aqua-barnacle-58](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=fedora-aqua-barnacle-58) is resizing to **large** while attaching **198.51.100.21**. Its list status is **Changes in progress**, and the popover names both operations. In the [mixed failure example](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=ubuntu-copper-ibis-31), resize has failed while attachment continues, so **Changes need attention** takes priority.

The [two-failure example](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=5a21b9e&role=admin&vm=debian-cobalt-heron-41) shows resize and external-IP failure as separate bullets in one alert. The IP remains unattached; **Resize again** opens the resize dialog with **large** selected for review.

![Version 0.5 final-failure popover with Open VM details button](screenshots/latest-ux/vm-config-final-failure-action-0.5-crop.png)

![Version 0.5 two failed changes in one alert](screenshots/latest-ux/vm-config-two-failures-0.5-crop.png)

![Version 0.5 Resize again dialog with the failed target selected](screenshots/latest-ux/vm-config-resize-again-dialog-0.5.png)

When a resize requires a restart, show a **Restart required** warning above Overview. It is collapsed by default; expanding it explains the required action and shows the current and requested instance type, vCPUs, and memory. Keep the current resource values in Configuration without repeating the warning there. This actionable warning is the exception to failure-only top alerts. In VM lists and cards, show one text-only configuration status on a second line below the icon-and-text power status: subdued gray **Changes pending** or **Changes in progress**, or **Changes need attention** in the failure color. Do not add an icon to the configuration status. The popover names each relevant operation and target, including external-IP attachment. Remove it once no work is outstanding.

![Version 0.5 collapsed top restart warning](screenshots/latest-ux/vm-config-restart-0.5-crop.png)

![Version 0.5 expanded top restart warning](screenshots/latest-ux/vm-config-restart-expanded-0.5-crop.png)

The Instance type pencil stays available while a saved resize awaits restart. **Edit scheduled resize** identifies the active and scheduled types. Users can replace the target, or select the active type to cancel the scheduled resize. The warning updates to the latest target and omits unchanged values. Backend support for replacing or canceling a pending resize must be confirmed.

![Version 0.5 edit scheduled resize dialog](screenshots/latest-ux/vm-edit-scheduled-resize-0.5.png)

![Version 0.5 revised scheduled resize warning](screenshots/latest-ux/vm-revised-scheduled-resize-0.5.png)

In card and table views, the VM list shows one configuration status below the power status. Activating it opens a popover that lists every outstanding operation and target.

![Version 0.5 VM cards with configuration status below power status](screenshots/latest-ux/vm-config-status-cards-0.5.png)

![Version 0.5 VM table with configuration status below power status](screenshots/latest-ux/vm-config-status-table-0.5-crop.png)

For access, networking, storage, utilization, failure states, and permissions, follow the [Google UX handoff](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit).

### Implementation data needed for OSAC-7158

The UI needs the operation type, phase (waiting for restart, retry scheduled, applying, finally failed, or complete), safe explanation, target value, and timestamps from the API or from documented derivation of its existing conditions. The UI must know whether another retry is planned before offering a manual action; an attempt count alone is insufficient. The list and Details must describe the same state after refresh or reconnect. API list/get and CLI table/json/yaml/describe need equivalent status semantics; the HTML mockup cannot verify those contracts. Never surface provider job IDs, raw logs, or raw error strings.

**Still to validate against OSAC-7158:** The mockup does not demonstrate a prerequisite blocker or elapsed time in the VM list. Both require reliable service data, including timestamps that survive reconnects. Confirm which existing conditions expose these values and the retry phase; if the UI must derive a summary, document the derivation for API and CLI parity. Do not present an unsupported phase, blocker, or elapsed time as confirmed UX coverage.

## Access and initial run examples

These 0.5 captures show the auto-attached, manually attached, inline Cloud-init, and Windows Sysprep states.

![Auto-attached external IP and Cloud-init secret](screenshots/latest-ux/vm-overview-auto-0.5.png)

![Manually attached external IP](screenshots/latest-ux/vm-overview-manual-0.5.png)

![Inline Cloud-init value](screenshots/latest-ux/vm-overview-inline-0.5.png)

![Windows Sysprep](screenshots/latest-ux/vm-overview-windows-0.5.png)

## Storage table typography

Networking and Additional disks column headings use the standard PatternFly 6 table heading typography in both versions: 14px semibold Red Hat Text in the regular text color. The same treatment applies to other custom table headers.

![Version 0.4 Storage section](screenshots/latest-ux/vm-overview-storage-0.4.png)

![Version 0.5 Storage section](screenshots/latest-ux/vm-overview-storage-0.5.png)
