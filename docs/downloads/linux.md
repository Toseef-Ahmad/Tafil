# Linux Installation

## Download

| Format | File | Best for |
|--------|------|----------|
| AppImage | `Tafil-x.x.x.AppImage` | Universal |
| DEB | `Tafil-x.x.x-amd64.deb` | Ubuntu, Debian |
| RPM | `Tafil-x.x.x-x86_64.rpm` | Fedora, RHEL |

[Download from GitHub Releases →](https://github.com/Toseef-Ahmad/Tafil/releases)

## AppImage (Universal)

Works on any Linux distribution.

```bash
# Make executable
chmod +x Tafil-*.AppImage

# Run
./Tafil-*.AppImage
```

**Optional:** Move to a standard location:

```bash
mv Tafil-*.AppImage ~/.local/bin/tafil
```

## Debian / Ubuntu (.deb)

```bash
sudo dpkg -i Tafil-*-amd64.deb
```

If dependencies are missing:

```bash
sudo apt-get install -f
```

## Fedora / RHEL (.rpm)

```bash
sudo rpm -i Tafil-*-x86_64.rpm
```

Or with DNF:

```bash
sudo dnf install Tafil-*-x86_64.rpm
```

## Uninstall

**AppImage:**
```bash
rm ~/.local/bin/tafil
```

**DEB:**
```bash
sudo apt remove tafil
```

**RPM:**
```bash
sudo rpm -e tafil
```

