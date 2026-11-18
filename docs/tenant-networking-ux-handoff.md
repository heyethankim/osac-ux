# Tenant Networking — UX handoff

Contact: Yifat Friman Menchik, UXD  
Google Doc: [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit)  
Interactive mock: [Tenant Networking 0.5, Tenant Admin](https://osac-project.github.io/osac-ux/vmaas-ux-prototype.html?v=0.5&role=admin&vm=indigo-quokka-89)

The Virtual networks list uses compact PatternFly pagination above and below the results: an item-range dropdown plus Previous and Next. The dropdown changes items per page (10, 20, 50, or 100). Filtering resets to the first page.

![Virtual networks list with compact pagination](screenshots/latest-ux/network-list.png)

Follow the [Google UX handoff](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit) for network and external IP attachment behavior, including loading and failure states.

On VM Overview, an auto-attached external IP shows **Auto attached** beside the External IP heading as a neutral, outlined PatternFly 6 felt glass status label. The address remains managed with the VM and cannot be detached separately.

The **External IP** heading is sufficient; do not add a Host label or empty placeholder below it. Show the address directly below the heading only after attachment succeeds. Detach is available only when an IP is confirmed attached.

In version **0.5** (OSAC-7158), show attachment progress or failure in a top-of-page alert above Overview instead of inline under External IP. Name the selected address, for example “Attaching external IP 198.51.100.99” or “Couldn’t attach external IP 198.51.100.99.” Show retry information only when known. The failed address must not appear as an attached IP, and there is no manual Retry, Choose another, or Detach action in the failure state.

![Auto attached external IP status label](screenshots/latest-ux/tenant-networking-auto-ip-badge.png)

![No external IP attached](screenshots/latest-ux/tenant-networking-no-ip.png)

![Manually attached external IP](screenshots/latest-ux/tenant-networking-manual-ip.png)
