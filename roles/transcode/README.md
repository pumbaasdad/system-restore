This role creates the configuration directory for a transcoder that will be run in a docker container.  The `handbrake`
transcoder will be used.  It's user interface can be accessed on port 5800.  The container is configured to
automatically transcode files that are placed in the media-rip output directory, and will place the output in the
transcoder output directory.

# Required Variables

 * transcode_dir: The configuration directory created by this role.  Defaults to `{{ docker_compose_dir }}/transcode`
 * transcode_nas_dir: A directory on the NAS that contains transcoder input and output directories.  Defaults to
   `{{ nas_media_dir }}/transcode`
  * transcode_output_dir: A directory on the NAS where the output of transcodes will be placed.  Defaults to
   `{{ transcode_nas_dir }}/output`.
 * transcode_keep_app_running: If the `handbrake` process should be restarted if it crashes.  Defaults to `1` (yes).
 * transcode_preset: The preset that `handbrake` will use us when automatically transcoding.  Defaults to
   `General/HQ 1080p30 Surround`.
 * transcode_keep_source_file: If the file that was transcoded should be kept after transcode completes.  Defaults to
   `0` (delete the file).
 * transcode_output_subdir: The subdirectory of `transcode_output_dir` where automatically transcoded files should be
   stored.  Defaults to `SAME_AS_SRC` (uses the same subdirectory as the file was in within `transcode_input_dir`).
 * transcode_input_stability_seconds: How long the transcoder will wait before it begins transcoding a file found in
   `transcode_input_dir`.  If the file changes within this time, the time to wait will reset.  This allows the
   transcoder to ensure that the file has been completely written before transcoding begins.  Defaults to `30` seconds.
 * transcode_input_check_seconds: How often the transcoder checks `transcoder_input_dir` for new files.  Defaults to
   `60` seconds.