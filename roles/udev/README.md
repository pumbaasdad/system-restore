# Description

This role is used to configure symlinks for udev devices that need to be accessed by other services.

# Parameters

| Parameter    | Member    | Description                                                                           |
|:-------------|:----------|:--------------------------------------------------------------------------------------|
| udev_devices |           | udev devices for which rules will be created.                                         |
 |              | subsystem | The subsystem to which the device belongs.                                            |
 |              | attrs     | A dictionary of key value pairs that can be used to uniquely identify an udev device. |
 |              | symlink   | A symlink that will be created to provide access to the udev device.                  |
