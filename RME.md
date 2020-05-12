8Another way to break the infinite loop is to build iPXE with an embedded script that directs iPXE to boot from a fixed URL. For example, if you create the script file demo.ipxe containing:

  #!ipxe
  
  dhcp
  chain http://boot.ipxe.org/demo/boot.php
and then build your own version of iPXE with this script embedded:

  make bin/undionly.kpxe EMBED=demo.ipxe
