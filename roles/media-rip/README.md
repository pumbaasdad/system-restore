This role creates the directories and device symlinks that are required to run media ripping software in a docker
container.  The software used to rip media will be `MakeMKV`.  It's user interface can be accessed on port 5801.
The container is configured to automatically rip any media inserted into the PC.

# Required Variables

 * optical_vendor: The vendor of the optical drive that will be used by `MakeMKV`.  This string will be used in a `udev`
   rule to identify the drive.  This information can be obtained by running the command `sudo udevadm info -a /dev/sr#`
   where `sr#` is the optical drive.
 * media_rip_dir: The directory used for media rip operations.  Defaults to `{{ docker_compose_dir }}/media-rip`.
 * media_rip_config_dir: The directory where the docker container will store any information that it needs to persist.
   Defaults to `{{ media_rip_dir }}/config`.
 * media_rip_output_dir: The directory to which `MakeMKV` will write output.  Defaults to `{{ media_rip_dir }}/output`.
 * media_rip_keep_app_running: If the `handbrake` process should be restarted if it crashes.  Defaults to `1` (yes).