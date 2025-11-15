# Installed Packages

This document contains a complete list of all installed packages in the Claude Code environment.

## Summary

- **Total Packages:** 675 (including libraries and dependencies)
- **Package Manager:** dpkg (Debian/Ubuntu)
- **Distribution:** Ubuntu 24.04.3 LTS (Noble Numbat)
- **Architecture:** amd64

## Package Statistics

```bash
# Get package count
dpkg -l | grep ^ii | wc -l

# Search for specific package
dpkg -l | grep <package-name>

# Get package details
dpkg -s <package-name>

# List files from package
dpkg -L <package-name>
```

## Complete Package List

Below is the complete output of `dpkg -l` showing all installed packages:

```
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                                 Version                               Architecture Description
+++-====================================-=====================================-============-================================================================================
ii  adduser                              3.137ubuntu1                          all          add and remove users and groups
ii  adwaita-icon-theme                   46.0-1                                all          default icon theme of GNOME
ii  apt                                  2.8.3                                 amd64        commandline package manager
ii  apt-transport-https                  2.8.3                                 all          transitional package for https support
ii  at-spi2-common                       2.52.0-1build1                        all          Assistive Technology Service Provider Interface (common files)
ii  autoconf                             2.71-3                                all          automatic configure script builder
ii  automake                             1:1.16.5-1.3ubuntu1                   all          Tool for generating GNU Standards-compliant Makefiles
ii  autotools-dev                        20220109.1                            all          Update infrastructure for config.{guess,sub} files
ii  base-files                           13ubuntu10.3                          amd64        Debian base system miscellaneous files
ii  base-passwd                          3.6.3build1                           amd64        Debian base system master password and group files
ii  bash                                 5.2.21-2ubuntu4                       amd64        GNU Bourne Again SHell
ii  bc                                   1.07.1-3ubuntu4                       amd64        GNU bc arbitrary precision calculator language
ii  binutils                             2.42-4ubuntu2.6                       amd64        GNU assembler, linker and binary utilities
ii  binutils-common:amd64                2.42-4ubuntu2.6                       amd64        Common files for the GNU assembler, linker and binary utilities
ii  binutils-x86-64-linux-gnu            2.42-4ubuntu2.6                       amd64        GNU binary utilities, for x86-64-linux-gnu target
ii  bison                                2:3.8.2+dfsg-1build2                  amd64        YACC-compatible parser generator
ii  bsdutils                             1:2.39.3-9ubuntu6.3                   amd64        basic utilities from 4.4BSD-Lite
ii  build-essential                      12.10ubuntu1                          amd64        Informational list of build-essential packages
ii  bzip2                                1.0.8-5.1build0.1                     amd64        high-quality block-sorting file compressor - utilities
ii  ca-certificates                      20240203                              all          Common CA certificates
ii  ca-certificates-java                 20240118                              all          Common CA certificates (JKS keystore)
ii  clang                                1:18.0-59~exp2                        amd64        C, C++ and Objective-C compiler (LLVM based), clang binary
ii  clang-18                             1:18.1.3-1ubuntu1                     amd64        C, C++ and Objective-C compiler
ii  clang-format:amd64                   1:18.0-59~exp2                        amd64        Tool to format C/C++/Obj-C code
ii  clang-format-18                      1:18.1.3-1ubuntu1                     amd64        Tool to format C/C++/Obj-C code
ii  clang-tidy                           1:18.0-59~exp2                        amd64        clang-based C++ linter tool
ii  clang-tidy-18                        1:18.1.3-1ubuntu1                     amd64        clang-based C++ linter tool
ii  clang-tools-18                       1:18.1.3-1ubuntu1                     amd64        clang-based tools for C/C++ developments
ii  cmake                                3.28.3-1build7                        amd64        cross-platform, open-source make system
ii  cmake-data                           3.28.3-1build7                        all          CMake data files (modules, templates and documentation)
ii  coreutils                            9.4-3ubuntu6.1                        amd64        GNU core utilities
ii  cpp                                  4:13.2.0-7ubuntu1                     amd64        GNU C preprocessor (cpp)
ii  cpp-13                               13.3.0-6ubuntu2~24.04                 amd64        GNU C preprocessor
ii  cpp-13-x86-64-linux-gnu              13.3.0-6ubuntu2~24.04                 amd64        GNU C preprocessor for x86_64-linux-gnu
ii  cpp-x86-64-linux-gnu                 4:13.2.0-7ubuntu1                     amd64        GNU C preprocessor (cpp) for the amd64 architecture
ii  curl                                 8.5.0-2ubuntu10.6                     amd64        command line tool for transferring data with URL syntax
ii  dash                                 0.5.12-6ubuntu5                       amd64        POSIX-compliant shell
ii  dbus                                 1.14.10-4ubuntu4.1                    amd64        simple interprocess messaging system (system message bus)
ii  dbus-bin                             1.14.10-4ubuntu4.1                    amd64        simple interprocess messaging system (command line utilities)
ii  dbus-daemon                          1.14.10-4ubuntu4.1                    amd64        simple interprocess messaging system (reference message bus)
ii  dbus-session-bus-common              1.14.10-4ubuntu4.1                    all          simple interprocess messaging system (session bus configuration)
ii  dbus-system-bus-common               1.14.10-4ubuntu4.1                    all          simple interprocess messaging system (system bus configuration)
ii  dbus-user-session                    1.14.10-4ubuntu4.1                    amd64        simple interprocess messaging system (systemd --user integration)
ii  dconf-gsettings-backend:amd64        0.40.0-4ubuntu0.1                     amd64        simple configuration storage system - GSettings back-end
ii  dconf-service                        0.40.0-4ubuntu0.1                     amd64        simple configuration storage system - D-Bus service
ii  debconf                              1.5.86ubuntu1                         all          Debian configuration management system
ii  debianutils                          5.17build1                            amd64        Miscellaneous utilities specific to Debian
ii  diffutils                            1:3.10-1build1                        amd64        File comparison utilities
ii  dirmngr                              2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - network certificate management service
ii  distro-info-data                     0.60ubuntu0.5                         all          information about the distributions' releases (data files)
ii  dpkg                                 1.22.6ubuntu6.5                       amd64        Debian package management system
ii  dpkg-dev                             1.22.6ubuntu6.5                       all          Debian package development tools
ii  e2fsprogs                            1.47.0-2.4~exp1ubuntu4.1              amd64        ext2/ext3/ext4 file system utilities
ii  file                                 1:5.45-3build1                        amd64        Recognize the type of data in a file using "magic" numbers
ii  findutils                            4.9.0-5build1                         amd64        utilities for finding files--find, xargs
ii  fontconfig                           2.15.0-1.1ubuntu2                     amd64        generic font configuration library - support binaries
ii  fontconfig-config                    2.15.0-1.1ubuntu2                     amd64        generic font configuration library - configuration
ii  fonts-dejavu-core                    2.37-8                                all          Vera font family derivate with additional characters
ii  fonts-dejavu-mono                    2.37-8                                all          Vera font family derivate with additional characters
ii  fonts-freefont-ttf                   20211204+svn4273-2                    all          Freefont Serif, Sans and Mono Truetype fonts
ii  fonts-ipafont-gothic                 00303-21ubuntu1                       all          Japanese OpenType font set, IPA Gothic and IPA P Gothic Fonts
ii  fonts-liberation                     1:2.1.5-3                             all          fonts with the same metrics as Times, Arial and Courier
ii  fonts-noto-color-emoji               2.047-0ubuntu0.24.04.1                all          color emoji font from Google
ii  fonts-opensymbol                     4:102.12+LibO24.2.7-0ubuntu0.24.04.4  all          OpenSymbol TrueType font
ii  fonts-tlwg-loma-otf                  1:0.7.3-1                             all          Thai Loma OpenType font
ii  fonts-unifont                        1:15.1.01-1build1                     all          OpenType version of GNU Unifont
ii  fonts-wqy-zenhei                     0.9.45-8                              all          "WenQuanYi Zen Hei" A Hei-Ti Style (sans-serif) Chinese font
ii  g++                                  4:13.2.0-7ubuntu1                     amd64        GNU C++ compiler
ii  g++-13                               13.3.0-6ubuntu2~24.04                 amd64        GNU C++ compiler
ii  g++-13-x86-64-linux-gnu              13.3.0-6ubuntu2~24.04                 amd64        GNU C++ compiler for x86_64-linux-gnu architecture
ii  g++-x86-64-linux-gnu                 4:13.2.0-7ubuntu1                     amd64        GNU C++ compiler for the amd64 architecture
ii  gcc                                  4:13.2.0-7ubuntu1                     amd64        GNU C compiler
ii  gcc-13                               13.3.0-6ubuntu2~24.04                 amd64        GNU C compiler
ii  gcc-13-base:amd64                    13.3.0-6ubuntu2~24.04                 amd64        GCC, the GNU Compiler Collection (base package)
ii  gcc-13-x86-64-linux-gnu              13.3.0-6ubuntu2~24.04                 amd64        GNU C compiler for the x86_64-linux-gnu architecture
ii  gcc-14-base:amd64                    14.2.0-4ubuntu2~24.04                 amd64        GCC, the GNU Compiler Collection (base package)
ii  gcc-x86-64-linux-gnu                 4:13.2.0-7ubuntu1                     amd64        GNU C compiler for the amd64 architecture
ii  gdb                                  15.0.50.20240403-0ubuntu1             amd64        GNU Debugger
ii  gir1.2-girepository-2.0:amd64        1.80.1-1                              amd64        Introspection data for GIRepository library
ii  gir1.2-glib-2.0:amd64                2.80.0-6ubuntu3.4                     amd64        Introspection data for GLib, GObject, Gio and GModule
ii  gir1.2-packagekitglib-1.0            1.2.8-2ubuntu1.2                      amd64        GObject introspection data for the PackageKit GLib library
ii  git                                  1:2.43.0-1ubuntu7.3                   amd64        fast, scalable, distributed revision control system
ii  git-man                              1:2.43.0-1ubuntu7.3                   all          fast, scalable, distributed revision control system (manual pages)
ii  gnupg                                2.4.4-2ubuntu17.3                     all          GNU privacy guard - a free PGP replacement
ii  gnupg-utils                          2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - utility programs
ii  gnupg2                               2.4.4-2ubuntu17.3                     all          GNU privacy guard - a free PGP replacement (dummy transitional package)
ii  gpg                                  2.4.4-2ubuntu17.3                     amd64        GNU Privacy Guard -- minimalist public key operations
ii  gpg-agent                            2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - cryptographic agent
ii  gpgconf                              2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - core configuration utilities
ii  gpgsm                                2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - S/MIME version
ii  gpgv                                 2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - signature verification tool
ii  grep                                 3.11-4build1                          amd64        GNU grep, egrep and fgrep
ii  gtk-update-icon-cache                3.24.41-4ubuntu1.3                    amd64        icon theme caching utility
ii  gzip                                 1.12-1ubuntu3.1                       amd64        GNU compression utilities
ii  hicolor-icon-theme                   0.17-2                                all          default fallback theme for FreeDesktop.org icon themes
ii  hostname                             3.23+nmu2ubuntu2                      amd64        utility to set/show the host name or domain name
ii  humanity-icon-theme                  0.6.16                                all          Humanity Icon theme
ii  init-system-helpers                  1.66ubuntu1                           all          helper tools for all init systems
ii  iso-codes                            4.16.0-1                              all          ISO language, territory, currency, script codes and their translations
ii  java-common                          0.75+exp1                             all          Base package for Java runtimes
ii  jq                                   1.7.1-3ubuntu0.24.04.1                amd64        lightweight and flexible command-line JSON processor
ii  keyboxd                              2.4.4-2ubuntu17.3                     amd64        GNU privacy guard - public key material service
ii  less                                 590-2ubuntu2.1                        amd64        pager program similar to more
ii  libabsl20220623t64:amd64             20220623.1-3.1ubuntu3.2               amd64        extensions to the C++ standard library
ii  libacl1:amd64                        2.3.2-1build1.1                       amd64        access control list - shared library
ii  libaom3:amd64                        3.8.2-2ubuntu0.1                      amd64        AV1 Video Codec Library
ii  libapparmor1:amd64                   4.0.1really4.0.1-0ubuntu0.24.04.4     amd64        changehat AppArmor library
ii  libappstream5:amd64                  1.0.2-1build6                         amd64        Library to access AppStream services
ii  libapt-pkg6.0t64:amd64               2.8.3                                 amd64        package management runtime library
ii  libarchive13t64:amd64                3.7.2-2ubuntu0.5                      amd64        Multi-format archive and compression library (shared library)
ii  libargon2-1:amd64                    0~20190702+dfsg-4build1               amd64        memory-hard hashing function - runtime library
ii  libasan8:amd64                       14.2.0-4ubuntu2~24.04                 amd64        AddressSanitizer -- a fast memory error detector
ii  libasound2-data                      1.2.11-1ubuntu0.1                     all          Configuration files and profiles for ALSA drivers
ii  libasound2t64:amd64                  1.2.11-1ubuntu0.1                     amd64        shared library for ALSA applications
ii  libassuan0:amd64                     2.5.6-1build1                         amd64        IPC library for the GnuPG components
ii  libatk-bridge2.0-0t64:amd64          2.52.0-1build1                        amd64        AT-SPI 2 toolkit bridge - shared library
ii  libatk1.0-0t64:amd64                 2.52.0-1build1                        amd64        ATK accessibility toolkit
ii  libatomic1:amd64                     14.2.0-4ubuntu2~24.04                 amd64        support library providing __atomic built-in functions
ii  libatspi2.0-0t64:amd64               2.52.0-1build1                        amd64        Assistive Technology Service Provider Interface - shared library
ii  libattr1:amd64                       1:2.5.2-1build1.1                     amd64        extended attribute handling - shared library
ii  libaudit-common                      1:3.1.2-2.1build1.1                   all          Dynamic library for security auditing - common files
ii  libaudit1:amd64                      1:3.1.2-2.1build1.1                   amd64        Dynamic library for security auditing
ii  libavahi-client3:amd64               0.8-13ubuntu6                         amd64        Avahi client library
ii  libavahi-common-data:amd64           0.8-13ubuntu6                         amd64        Avahi common data files
ii  libavahi-common3:amd64               0.8-13ubuntu6                         amd64        Avahi common library
ii  libavif16:amd64                      1.0.4-1ubuntu3                        amd64        Library for handling .avif files
ii  libbabeltrace1:amd64                 1.5.11-3build3                        amd64        Babeltrace conversion libraries
ii  libbinutils:amd64                    2.42-4ubuntu2.6                       amd64        GNU binary utilities (private shared library)
ii  libblkid-dev:amd64                   2.39.3-9ubuntu6.3                     amd64        block device ID library - headers
ii  libblkid1:amd64                      2.39.3-9ubuntu6.3                     amd64        block device ID library
ii  libboost-iostreams1.83.0:amd64       1.83.0-2.1ubuntu3.1                   amd64        Boost.Iostreams Library
ii  libboost-locale1.83.0:amd64          1.83.0-2.1ubuntu3.1                   amd64        C++ facilities for localization
ii  libboost-thread1.83.0:amd64          1.83.0-2.1ubuntu3.1                   amd64        portable C++ multi-threading
ii  libbrotli-dev:amd64                  1.1.0-2build2                         amd64        library implementing brotli encoder and decoder (development files)
ii  libbrotli1:amd64                     1.1.0-2build2                         amd64        library implementing brotli encoder and decoder (shared libraries)
ii  libbsd0:amd64                        0.12.1-1build1.1                      amd64        utility functions from BSD systems - shared library
ii  libbz2-1.0:amd64                     1.0.8-5.1build0.1                     amd64        high-quality block-sorting file compressor library - runtime
ii  libbz2-dev:amd64                     1.0.8-5.1build0.1                     amd64        high-quality block-sorting file compressor library - development
ii  libc-bin                             2.39-0ubuntu8.6                       amd64        GNU C Library: Binaries
ii  libc-dev-bin                         2.39-0ubuntu8.6                       amd64        GNU C Library: Development binaries
ii  libc6:amd64                          2.39-0ubuntu8.6                       amd64        GNU C Library: Shared libraries
ii  libc6-dbg:amd64                      2.39-0ubuntu8.6                       amd64        GNU C Library: detached debugging symbols
ii  libc6-dev:amd64                      2.39-0ubuntu8.6                       amd64        GNU C Library: Development Libraries and Header Files
ii  libcairo-gobject2:amd64              1.18.0-3build1                        amd64        Cairo 2D vector graphics library (GObject library)
ii  libcairo-script-interpreter2:amd64   1.18.0-3build1                        amd64        Cairo 2D vector graphics library (script interpreter)
ii  libcairo2:amd64                      1.18.0-3build1                        amd64        Cairo 2D vector graphics library
ii  libcairo2-dev:amd64                  1.18.0-3build1                        amd64        Development files for the Cairo 2D graphics library
ii  libcap-ng0:amd64                     0.8.4-2build2                         amd64        alternate POSIX capabilities library
ii  libcap2:amd64                        1:2.66-5ubuntu2.2                     amd64        POSIX 1003.1e capabilities (library)
ii  libcap2-bin                          1:2.66-5ubuntu2.2                     amd64        POSIX 1003.1e capabilities (utilities)
ii  libcc1-0:amd64                       14.2.0-4ubuntu2~24.04                 amd64        GCC cc1 plugin for GDB
ii  libclang-common-18-dev:amd64         1:18.1.3-1ubuntu1                     amd64        Clang library - Common development package
ii  libclang-cpp18                       1:18.1.3-1ubuntu1                     amd64        C++ interface to the Clang library
ii  libclang1-18                         1:18.1.3-1ubuntu1                     amd64        C interface to the Clang library
ii  libclucene-contribs1t64:amd64        2.3.3.4+dfsg-1.2ubuntu2               amd64        language specific text analyzers (runtime)
ii  libclucene-core1t64:amd64            2.3.3.4+dfsg-1.2ubuntu2               amd64        core library for full-featured text search engine (runtime)
ii  libcolord2:amd64                     1.4.7-1build2                         amd64        system service to manage device colour profiles -- runtime
ii  libcom-err2:amd64                    1.47.0-2.4~exp1ubuntu4.1              amd64        common error description library
ii  libcrypt-dev:amd64                   1:4.4.36-4build1                      amd64        libcrypt development files
ii  libcrypt1:amd64                      1:4.4.36-4build1                      amd64        libcrypt shared library
ii  libcryptsetup12:amd64                2:2.7.0-1ubuntu4.2                    amd64        disk encryption support - shared library
ii  libctf-nobfd0:amd64                  2.42-4ubuntu2.6                       amd64        Compact C Type Format library (runtime, no BFD dependency)
ii  libctf0:amd64                        2.42-4ubuntu2.6                       amd64        Compact C Type Format library (runtime, BFD dependency)
ii  libcups2t64:amd64                    2.4.7-1.2ubuntu7.4                    amd64        Common UNIX Printing System(tm) - Core library
ii  libcurl3t64-gnutls:amd64             8.5.0-2ubuntu10.6                     amd64        easy-to-use client-side URL transfer library (GnuTLS flavour)
ii  libcurl4t64:amd64                    8.5.0-2ubuntu10.6                     amd64        easy-to-use client-side URL transfer library (OpenSSL flavour)
ii  libdatrie1:amd64                     0.2.13-3build1                        amd64        Double-array trie library
ii  libdav1d7:amd64                      1.4.1-1build1                         amd64        fast and small AV1 video stream decoder (shared library)
ii  libdb-dev:amd64                      1:5.3.21ubuntu2                       amd64        Berkeley Database Libraries [development]
ii  libdb5.3-dev                         5.3.28+dfsg2-7                        amd64        Berkeley v5.3 Database Libraries [development]
ii  libdb5.3t64:amd64                    5.3.28+dfsg2-7                        amd64        Berkeley v5.3 Database Libraries [runtime]
ii  libdbus-1-3:amd64                    1.14.10-4ubuntu4.1                    amd64        simple interprocess messaging system (library)
ii  libdconf1:amd64                      0.40.0-4ubuntu0.1                     amd64        simple configuration storage system - runtime library
ii  libde265-0:amd64                     1.0.15-1build3                        amd64        Open H.265 video codec implementation
ii  libdebconfclient0:amd64              0.271ubuntu3                          amd64        Debian Configuration Management System (C-implementation library)
ii  libdebuginfod-common                 0.190-1.1ubuntu0.1                    all          configuration to enable the Debian debug info server
ii  libdebuginfod1t64:amd64              0.190-1.1ubuntu0.1                    amd64        library to interact with debuginfod (development files)
ii  libdeflate0:amd64                    1.19-1build1.1                        amd64        fast, whole-buffer DEFLATE-based compression and decompression
ii  libdevmapper1.02.1:amd64             2:1.02.185-3ubuntu3.2                 amd64        Linux Kernel Device Mapper userspace library
ii  libdpkg-perl                         1.22.6ubuntu6.5                       all          Dpkg perl modules
ii  libdrm-amdgpu1:amd64                 2.4.122-1~ubuntu0.24.04.1             amd64        Userspace interface to amdgpu-specific kernel DRM services -- runtime
ii  libdrm-common                        2.4.122-1~ubuntu0.24.04.1             all          Userspace interface to kernel DRM services -- common files
ii  libdrm-intel1:amd64                  2.4.122-1~ubuntu0.24.04.1             amd64        Userspace interface to intel-specific kernel DRM services -- runtime
ii  libdrm2:amd64                        2.4.122-1~ubuntu0.24.04.1             amd64        Userspace interface to kernel DRM services -- runtime
ii  libduktape207:amd64                  2.7.0+tests-0ubuntu3                  amd64        embeddable Javascript engine, library
ii  libdw1t64:amd64                      0.190-1.1ubuntu0.1                    amd64        library that provides access to the DWARF debug information
ii  libedit2:amd64                       3.1-20230828-1build1                  amd64        BSD editline and history libraries
ii  libelf1t64:amd64                     0.190-1.1ubuntu0.1                    amd64        library to read and write ELF files
ii  libeot0:amd64                        0.01-5build3                          amd64        Library for parsing/converting Embedded OpenType files
ii  libepoxy0:amd64                      1.5.10-1build1                        amd64        OpenGL function pointer management library
ii  liberror-perl                        0.17029-2                             all          Perl module for error/exception handling in an OO-ish way
ii  libevent-core-2.1-7t64:amd64         2.1.12-stable-9ubuntu2                amd64        Asynchronous event notification library (core)
ii  libexpat1:amd64                      2.6.1-2ubuntu0.3                      amd64        XML parsing C library - runtime library
ii  libexpat1-dev:amd64                  2.6.1-2ubuntu0.3                      amd64        XML parsing C library - development kit
ii  libext2fs2t64:amd64                  1.47.0-2.4~exp1ubuntu4.1              amd64        ext2/ext3/ext4 file system libraries
ii  libexttextcat-2.0-0:amd64            3.4.7-1build1                         amd64        Language detection library
ii  libexttextcat-data                   3.4.7-1build1                         all          Language detection library - data files
ii  libfdisk1:amd64                      2.39.3-9ubuntu6.3                     amd64        fdisk partitioning library
ii  libffi-dev:amd64                     3.4.6-1build1                         amd64        Foreign Function Interface library (development files)
ii  libffi8:amd64                        3.4.6-1build1                         amd64        Foreign Function Interface library runtime
ii  libfontconfig-dev:amd64              2.15.0-1.1ubuntu2                     amd64        generic font configuration library - development
ii  libfontconfig1:amd64                 2.15.0-1.1ubuntu2                     amd64        generic font configuration library - runtime
ii  libfontenc1:amd64                    1:1.1.8-1build1                       amd64        X11 font encoding library
ii  libfreetype-dev:amd64                2.13.2+dfsg-1build3                   amd64        FreeType 2 font engine, development files
ii  libfreetype6:amd64                   2.13.2+dfsg-1build3                   amd64        FreeType 2 font engine, shared library files
ii  libfribidi0:amd64                    1.0.13-3build1                        amd64        Free Implementation of the Unicode BiDi algorithm
ii  libgav1-1:amd64                      0.18.0-1build3                        amd64        AV1 decoder developed by Google -- runtime library
ii  libgbm1:amd64                        25.0.7-0ubuntu0.24.04.2               amd64        generic buffer management API -- runtime
ii  libgc1:amd64                         1:8.2.6-1build1                       amd64        conservative garbage collector for C and C++
ii  libgcc-13-dev:amd64                  13.3.0-6ubuntu2~24.04                 amd64        GCC support library (development files)
ii  libgcc-s1:amd64                      14.2.0-4ubuntu2~24.04                 amd64        GCC support library
ii  libgcrypt20:amd64                    1.10.3-2build1                        amd64        LGPL Crypto library - runtime library
ii  libgd3:amd64                         2.3.3-13+ubuntu24.04.1+deb.sury.org+1 amd64        GD Graphics Library
ii  libgdbm-compat-dev:amd64             1.23-5.1build1                        amd64        GNU dbm database routines (legacy support development files) 
ii  libgdbm-compat4t64:amd64             1.23-5.1build1                        amd64        GNU dbm database routines (legacy support runtime version) 
ii  libgdbm-dev:amd64                    1.23-5.1build1                        amd64        GNU dbm database routines (development files) 
ii  libgdbm6t64:amd64                    1.23-5.1build1                        amd64        GNU dbm database routines (runtime version) 
ii  libgdk-pixbuf-2.0-0:amd64            2.42.10+dfsg-3ubuntu3.2               amd64        GDK Pixbuf library
ii  libgdk-pixbuf2.0-common              2.42.10+dfsg-3ubuntu3.2               all          GDK Pixbuf library - data files
ii  libgif7:amd64                        5.2.2-1ubuntu1                        amd64        library for GIF images (library)
ii  libgirepository-1.0-1:amd64          1.80.1-1                              amd64        Library for handling GObject introspection data (runtime library)
ii  libgirepository-2.0-0:amd64          2.80.0-6ubuntu3.4                     amd64        GLib runtime library for handling GObject introspection data
ii  libgl1:amd64                         1.7.0-1build1                         amd64        Vendor neutral GL dispatch library -- legacy GL support
ii  libgl1-mesa-dri:amd64                25.0.7-0ubuntu0.24.04.2               amd64        free implementation of the OpenGL API -- DRI modules
ii  libglib2.0-0t64:amd64                2.80.0-6ubuntu3.4                     amd64        GLib library of C routines
ii  libglib2.0-bin                       2.80.0-6ubuntu3.4                     amd64        Programs for the GLib library
ii  libglib2.0-data                      2.80.0-6ubuntu3.4                     all          Common files for GLib library
ii  libglib2.0-dev:amd64                 2.80.0-6ubuntu3.4                     amd64        Development files for the GLib library
ii  libglib2.0-dev-bin                   2.80.0-6ubuntu3.4                     amd64        Development utilities for the GLib library
ii  libglvnd0:amd64                      1.7.0-1build1                         amd64        Vendor neutral GL dispatch library
ii  libglx-mesa0:amd64                   25.0.7-0ubuntu0.24.04.2               amd64        free implementation of the OpenGL API -- GLX vendor library
ii  libglx0:amd64                        1.7.0-1build1                         amd64        Vendor neutral GL dispatch library -- GLX support
ii  libgmp10:amd64                       2:6.3.0+dfsg-2ubuntu6.1               amd64        Multiprecision arithmetic library
ii  libgnutls30t64:amd64                 3.8.3-1.1ubuntu3.4                    amd64        GNU TLS library - main runtime library
ii  libgomp1:amd64                       14.2.0-4ubuntu2~24.04                 amd64        GCC OpenMP (GOMP) support library
ii  libgpg-error0:amd64                  1.47-3build2.1                        amd64        GnuPG development runtime library
ii  libgpgme11t64:amd64                  1.18.0-4.1ubuntu4                     amd64        GPGME - GnuPG Made Easy (library)
ii  libgpgmepp6t64:amd64                 1.18.0-4.1ubuntu4                     amd64        C++ wrapper library for GPGME
ii  libgpm2:amd64                        1.20.7-11                             amd64        General Purpose Mouse - shared library
ii  libgprofng0:amd64                    2.42-4ubuntu2.6                       amd64        GNU Next Generation profiler (runtime library)
ii  libgraphite2-3:amd64                 1.3.14-2build1                        amd64        Font rendering engine for Complex Scripts -- library
ii  libgssapi-krb5-2:amd64               1.20.1-6ubuntu2.6                     amd64        MIT Kerberos runtime libraries - krb5 GSS-API Mechanism
ii  libgstreamer-plugins-base1.0-0:amd64 1.24.2-1ubuntu0.3                     amd64        GStreamer libraries from the "base" set
ii  libgstreamer1.0-0:amd64              1.24.2-1ubuntu0.1                     amd64        Core GStreamer libraries and elements
ii  libgtk-3-0t64:amd64                  3.24.41-4ubuntu1.3                    amd64        GTK graphical user interface library
ii  libgtk-3-common                      3.24.41-4ubuntu1.3                    all          common files for the GTK graphical user interface library
ii  libharfbuzz-icu0:amd64               8.3.0-2build2                         amd64        OpenType text shaping engine ICU backend
ii  libharfbuzz0b:amd64                  8.3.0-2build2                         amd64        OpenType text shaping engine (shared library)
ii  libheif-plugin-aomdec:amd64          1.17.6-1ubuntu4.1                     amd64        ISO/IEC 23008-12:2017 HEIF file format decoder - aomdec plugin
ii  libheif-plugin-libde265:amd64        1.17.6-1ubuntu4.1                     amd64        ISO/IEC 23008-12:2017 HEIF file format decoder - libde265 plugin
ii  libheif1:amd64                       1.17.6-1ubuntu4.1                     amd64        ISO/IEC 23008-12:2017 HEIF file format decoder - shared library
ii  libhogweed6t64:amd64                 3.9.1-2.2build1.1                     amd64        low level cryptographic library (public-key cryptos)
ii  libhunspell-1.7-0:amd64              1.7.2+really1.7.2-10build3            amd64        spell checker and morphological analyzer (shared library)
ii  libhwasan0:amd64                     14.2.0-4ubuntu2~24.04                 amd64        AddressSanitizer -- a fast memory error detector
ii  libhyphen0:amd64                     2.8.8-7build3                         amd64        ALTLinux hyphenation library - shared library
ii  libice-dev:amd64                     2:1.0.10-1build3                      amd64        X11 Inter-Client Exchange library (development headers)
ii  libice6:amd64                        2:1.0.10-1build3                      amd64        X11 Inter-Client Exchange library
ii  libicu74:amd64                       74.2-1ubuntu3.1                       amd64        International Components for Unicode
ii  libidn2-0:amd64                      2.3.7-2build1.1                       amd64        Internationalized domain names (IDNA2008/TR46) library
ii  libimagequant0:amd64                 2.18.0-1build1                        amd64        palette quantization library
ii  libipt2                              2.0.6-1build1                         amd64        Intel Processor Trace Decoder Library
ii  libisl23:amd64                       0.26-3build1.1                        amd64        manipulating sets and relations of integer points bounded by linear constraints
ii  libitm1:amd64                        14.2.0-4ubuntu2~24.04                 amd64        GNU Transactional Memory Library
ii  libjansson4:amd64                    2.14-2build2                          amd64        C library for encoding, decoding and manipulating JSON data
ii  libjbig0:amd64                       2.1-6.1ubuntu2                        amd64        JBIGkit libraries
ii  libjemalloc2:amd64                   5.3.0-2build1                         amd64        general-purpose scalable concurrent malloc(3) implementation
ii  libjpeg-turbo8:amd64                 2.1.5-2ubuntu2                        amd64        libjpeg-turbo JPEG runtime library
ii  libjpeg8:amd64                       8c-2ubuntu11                          amd64        Independent JPEG Group's JPEG runtime library (dependency package)
ii  libjq1:amd64                         1.7.1-3ubuntu0.24.04.1                amd64        lightweight and flexible command-line JSON processor - shared library
ii  libjs-jquery                         3.6.1+dfsg+~3.5.14-1                  all          JavaScript library for dynamic web applications
ii  libjs-sphinxdoc                      7.2.6-6                               all          JavaScript support for Sphinx documentation
ii  libjs-underscore                     1.13.4~dfsg+~1.11.4-3                 all          JavaScript's functional programming helper library
ii  libjson-c5:amd64                     0.17-1build1                          amd64        JSON manipulation library - shared library
ii  libjson-perl                         4.10000-1                             all          module for manipulating JSON-formatted data
ii  libjsoncpp25:amd64                   1.9.5-6build1                         amd64        library for reading and writing JSON for C++
ii  libk5crypto3:amd64                   1.20.1-6ubuntu2.6                     amd64        MIT Kerberos runtime libraries - Crypto Library
ii  libkeyutils1:amd64                   1.6.3-3build1                         amd64        Linux Key Management Utilities (library)
ii  libkmod2:amd64                       31+20240202-2ubuntu7.1                amd64        libkmod shared library
ii  libkrb5-3:amd64                      1.20.1-6ubuntu2.6                     amd64        MIT Kerberos runtime libraries
ii  libkrb5support0:amd64                1.20.1-6ubuntu2.6                     amd64        MIT Kerberos runtime libraries - Support library
ii  libksba8:amd64                       1.6.6-1build1                         amd64        X.509 and CMS support library
ii  liblangtag-common                    0.6.7-1build2                         all          library to access tags for identifying languages -- data
ii  liblangtag1:amd64                    0.6.7-1build2                         amd64        library to access tags for identifying languages
ii  liblcms2-2:amd64                     2.14-2build1                          amd64        Little CMS 2 color management library
ii  libldap2:amd64                       2.6.7+dfsg-1~exp1ubuntu8.2            amd64        OpenLDAP libraries
ii  liblerc4:amd64                       4.0.0+ds-4ubuntu2                     amd64        Limited Error Raster Compression library
ii  liblldb-18                           1:18.1.3-1ubuntu1                     amd64        Next generation, high-performance debugger, library
ii  libllvm17t64:amd64                   1:17.0.6-9ubuntu1                     amd64        Modular compiler and toolchain technologies, runtime library
ii  libllvm18:amd64                      1:18.1.3-1ubuntu1                     amd64        Modular compiler and toolchain technologies, runtime library
ii  libllvm20:amd64                      1:20.1.2-0ubuntu1~24.04.2             amd64        Modular compiler and toolchain technologies, runtime library
ii  liblsan0:amd64                       14.2.0-4ubuntu2~24.04                 amd64        LeakSanitizer -- a memory leak detector (runtime)
ii  libltdl7:amd64                       2.4.7-7build1                         amd64        System independent dlopen wrapper for GNU libtool
ii  liblz4-1:amd64                       1.9.4-1build1.1                       amd64        Fast LZ compression algorithm library - runtime
ii  liblzf1:amd64                        3.6-4                                 amd64        Very small data compression library
ii  liblzma-dev:amd64                    5.6.1+really5.4.5-1ubuntu0.2          amd64        XZ-format compression library - development files
ii  liblzma5:amd64                       5.6.1+really5.4.5-1ubuntu0.2          amd64        XZ-format compression library
ii  liblzo2-2:amd64                      2.10-2build4                          amd64        data compression library
ii  libmagic-mgc                         1:5.45-3build1                        amd64        File type determination library using "magic" numbers (compiled magic file)
ii  libmagic1t64:amd64                   1:5.45-3build1                        amd64        Recognize the type of data in a file using "magic" numbers - library
ii  libmd0:amd64                         1.1.0-2build1.1                       amd64        message digest functions from BSD systems - shared library
ii  libmhash2:amd64                      0.9.9.9-9build3                       amd64        Library for cryptographic hashing and message authentication
ii  libmount-dev:amd64                   2.39.3-9ubuntu6.3                     amd64        device mounting library - headers
ii  libmount1:amd64                      2.39.3-9ubuntu6.3                     amd64        device mounting library
ii  libmpc3:amd64                        1.3.1-1build1.1                       amd64        multiple precision complex floating-point library
ii  libmpfr6:amd64                       4.2.1-1build1.1                       amd64        multiple precision floating-point computation
ii  libmythes-1.2-0:amd64                2:1.2.5-1build1                       amd64        simple thesaurus library
ii  libncurses-dev:amd64                 6.4+20240113-1ubuntu2                 amd64        developer's libraries for ncurses
ii  libncurses6:amd64                    6.4+20240113-1ubuntu2                 amd64        shared libraries for terminal handling
ii  libncursesw6:amd64                   6.4+20240113-1ubuntu2                 amd64        shared libraries for terminal handling (wide character support)
ii  libnettle8t64:amd64                  3.9.1-2.2build1.1                     amd64        low level cryptographic library (symmetric and one-way cryptos)
ii  libnghttp2-14:amd64                  1.59.0-1ubuntu0.2                     amd64        library implementing HTTP/2 protocol (shared library)
ii  libnpth0t64:amd64                    1.6-3.1build1                         amd64        replacement for GNU Pth using system threads
ii  libnspr4:amd64                       2:4.35-1.1build1                      amd64        NetScape Portable Runtime Library
ii  libnss3:amd64                        2:3.98-1build1                        amd64        Network Security Service libraries
ii  libobjc-13-dev:amd64                 13.3.0-6ubuntu2~24.04                 amd64        Runtime library for GNU Objective-C applications (development files)
ii  libobjc4:amd64                       14.2.0-4ubuntu2~24.04                 amd64        Runtime library for GNU Objective-C applications
ii  libonig5:amd64                       6.9.9-1build1                         amd64        regular expressions library
ii  libopenjp2-7:amd64                   2.5.0-2ubuntu0.4                      amd64        JPEG 2000 image compression/decompression library
ii  liborc-0.4-0t64:amd64                1:0.4.38-1ubuntu0.1                   amd64        Library of Optimized Inner Loops Runtime Compiler
ii  liborcus-0.18-0:amd64                0.19.2-3build3                        amd64        library for processing spreadsheet documents
ii  liborcus-parser-0.18-0:amd64         0.19.2-3build3                        amd64        library for processing spreadsheet documents - parser library
ii  libp11-kit0:amd64                    0.25.3-4ubuntu2.1                     amd64        library for loading and coordinating access to PKCS#11 modules - runtime
ii  libpackagekit-glib2-18:amd64         1.2.8-2ubuntu1.2                      amd64        Library for accessing PackageKit using GLib
ii  libpam-modules:amd64                 1.5.3-5ubuntu5.5                      amd64        Pluggable Authentication Modules for PAM
ii  libpam-modules-bin                   1.5.3-5ubuntu5.5                      amd64        Pluggable Authentication Modules for PAM - helper binaries
ii  libpam-runtime                       1.5.3-5ubuntu5.5                      all          Runtime support for the PAM library
ii  libpam-systemd:amd64                 255.4-1ubuntu8.11                     amd64        system and service manager - PAM module
ii  libpam0g:amd64                       1.5.3-5ubuntu5.5                      amd64        Pluggable Authentication Modules library
ii  libpango-1.0-0:amd64                 1.52.1+ds-1build1                     amd64        Layout and rendering of internationalized text
ii  libpangocairo-1.0-0:amd64            1.52.1+ds-1build1                     amd64        Layout and rendering of internationalized text
ii  libpangoft2-1.0-0:amd64              1.52.1+ds-1build1                     amd64        Layout and rendering of internationalized text
ii  libpciaccess0:amd64                  0.17-3ubuntu0.24.04.2                 amd64        Generic PCI access library for X
ii  libpcre2-16-0:amd64                  10.42-4ubuntu2.1                      amd64        New Perl Compatible Regular Expression Library - 16 bit runtime files
ii  libpcre2-32-0:amd64                  10.42-4ubuntu2.1                      amd64        New Perl Compatible Regular Expression Library - 32 bit runtime files
ii  libpcre2-8-0:amd64                   10.42-4ubuntu2.1                      amd64        New Perl Compatible Regular Expression Library- 8 bit runtime files
ii  libpcre2-dev:amd64                   10.42-4ubuntu2.1                      amd64        New Perl Compatible Regular Expression Library - development files
ii  libpcre2-posix3:amd64                10.42-4ubuntu2.1                      amd64        New Perl Compatible Regular Expression Library - posix-compatible runtime files
ii  libpcsclite1:amd64                   2.0.3-1build1                         amd64        Middleware to access a smart card using PC/SC (library)
ii  libperl5.38t64:amd64                 5.38.2-3.2ubuntu0.2                   amd64        shared Perl library
ii  libpfm4:amd64                        4.13.0+git32-g0d4ed0e-1               amd64        Library to program the performance monitoring events
ii  libpixman-1-0:amd64                  0.42.2-1build1                        amd64        pixel-manipulation library for X and cairo
ii  libpixman-1-dev:amd64                0.42.2-1build1                        amd64        pixel-manipulation library for X and cairo (development files)
ii  libpkgconf3:amd64                    1.8.1-2build1                         amd64        shared library for pkgconf
ii  libpng-dev:amd64                     1.6.43-5build1                        amd64        PNG library - development (version 1.6)
ii  libpng16-16t64:amd64                 1.6.43-5build1                        amd64        PNG library - runtime (version 1.6)
ii  libpolkit-agent-1-0:amd64            124-2ubuntu1.24.04.2                  amd64        polkit Authentication Agent API
ii  libpolkit-gobject-1-0:amd64          124-2ubuntu1.24.04.2                  amd64        polkit Authorization API
ii  libpoppler134:amd64                  24.02.0-1ubuntu9.8                    amd64        PDF rendering library
ii  libpq5:amd64                         16.10-0ubuntu0.24.04.1                amd64        PostgreSQL C client library
ii  libproc2-0:amd64                     2:4.0.4-4ubuntu3.2                    amd64        library for accessing process information from /proc
ii  libpsl5t64:amd64                     0.21.2-1.1build1                      amd64        Library for Public Suffix List (shared libraries)
ii  libpthread-stubs0-dev:amd64          0.4-1build3                           amd64        pthread stubs not provided by native libc, development files
ii  libpython3-dev:amd64                 3.12.3-0ubuntu2.1                     amd64        header files and a static library for Python (default)
ii  libpython3-stdlib:amd64              3.12.3-0ubuntu2.1                     amd64        interactive high-level object-oriented language (default python3 version)
ii  libpython3.10:amd64                  3.10.19-1+noble1                      amd64        Shared Python runtime library (version 3.10)
ii  libpython3.10-dev:amd64              3.10.19-1+noble1                      amd64        Header files and a static library for Python (v3.10)
ii  libpython3.10-minimal:amd64          3.10.19-1+noble1                      amd64        Minimal subset of the Python language (version 3.10)
ii  libpython3.10-stdlib:amd64           3.10.19-1+noble1                      amd64        Interactive high-level object-oriented language (standard library, version 3.10)
ii  libpython3.11:amd64                  3.11.14-1+noble1                      amd64        Shared Python runtime library (version 3.11)
ii  libpython3.11-dev:amd64              3.11.14-1+noble1                      amd64        Header files and a static library for Python (v3.11)
ii  libpython3.11-minimal:amd64          3.11.14-1+noble1                      amd64        Minimal subset of the Python language (version 3.11)
ii  libpython3.11-stdlib:amd64           3.11.14-1+noble1                      amd64        Interactive high-level object-oriented language (standard library, version 3.11)
ii  libpython3.12-dev:amd64              3.12.3-1ubuntu0.8                     amd64        Header files and a static library for Python (v3.12)
ii  libpython3.12-minimal:amd64          3.12.3-1ubuntu0.8                     amd64        Minimal subset of the Python language (version 3.12)
ii  libpython3.12-stdlib:amd64           3.12.3-1ubuntu0.8                     amd64        Interactive high-level object-oriented language (standard library, version 3.12)
ii  libpython3.12t64:amd64               3.12.3-1ubuntu0.8                     amd64        Shared Python runtime library (version 3.12)
ii  libpython3.13:amd64                  3.13.8-1+noble1                       amd64        Shared Python runtime library (version 3.13)
ii  libpython3.13-dev:amd64              3.13.8-1+noble1                       amd64        Header files and a static library for Python (v3.13)
ii  libpython3.13-stdlib:amd64           3.13.8-1+noble1                       amd64        Interactive high-level object-oriented language (standard library, version 3.13)
ii  libquadmath0:amd64                   14.2.0-4ubuntu2~24.04                 amd64        GCC Quad-Precision Math Library
ii  libraptor2-0:amd64                   2.0.16-3ubuntu0.1                     amd64        Raptor 2 RDF syntax library
ii  librasqal3t64:amd64                  0.9.33-2.1build1                      amd64        Rasqal RDF query library
ii  librav1e0:amd64                      0.7.1-2                               amd64        Fastest and safest AV1 encoder - shared library
ii  librdf0t64:amd64                     1.0.17-3.1ubuntu3                     amd64        Redland Resource Description Framework (RDF) library
ii  libreadline-dev:amd64                8.2-4build1                           amd64        GNU readline and history libraries, development files
ii  libreadline8t64:amd64                8.2-4build1                           amd64        GNU readline and history libraries, run-time libraries
ii  libreoffice-common                   4:24.2.7-0ubuntu0.24.04.4             all          office productivity suite -- arch-independent files
ii  libreoffice-core                     4:24.2.7-0ubuntu0.24.04.4             amd64        office productivity suite -- arch-dependent files
ii  libreoffice-style-colibre            4:24.2.7-0ubuntu0.24.04.4             all          office productivity suite -- colibre symbol style
ii  libreoffice-uiconfig-common          4:24.2.7-0ubuntu0.24.04.4             all          UI data ("config") for LibreOffice ("common" set)
ii  librevenge-0.0-0:amd64               0.0.5-3build1                         amd64        Base Library for writing document interface filters
ii  librhash0:amd64                      1.4.3-3build1                         amd64        shared library for hash functions computing
ii  librtmp1:amd64                       2.4+20151223.gitfa8646d.1-2build7     amd64        toolkit for RTMP streams (shared library)
ii  libsasl2-2:amd64                     2.1.28+dfsg1-5ubuntu3.1               amd64        Cyrus SASL - authentication abstraction library
ii  libsasl2-modules-db:amd64            2.1.28+dfsg1-5ubuntu3.1               amd64        Cyrus SASL - pluggable authentication modules (DB)
ii  libseccomp2:amd64                    2.5.5-1ubuntu3.1                      amd64        high level interface to Linux seccomp filter
ii  libselinux1:amd64                    3.5-2ubuntu2.1                        amd64        SELinux runtime shared libraries
ii  libselinux1-dev:amd64                3.5-2ubuntu2.1                        amd64        SELinux development headers
ii  libsemanage-common                   3.5-1build5                           all          Common files for SELinux policy management libraries
ii  libsemanage2:amd64                   3.5-1build5                           amd64        SELinux policy management library
ii  libsensors-config                    1:3.6.0-9build1                       all          lm-sensors configuration files
ii  libsensors5:amd64                    1:3.6.0-9build1                       amd64        library to read temperature/voltage/fan sensors
ii  libsepol-dev:amd64                   3.5-2build1                           amd64        SELinux binary policy manipulation library and development files
ii  libsepol2:amd64                      3.5-2build1                           amd64        SELinux library for manipulating binary security policies
ii  libsframe1:amd64                     2.42-4ubuntu2.6                       amd64        Library to handle the SFrame format (runtime library)
ii  libsharpyuv0:amd64                   1.3.2-0.4build3                       amd64        Library for sharp RGB to YUV conversion
ii  libsm-dev:amd64                      2:1.2.3-1build3                       amd64        X11 Session Management library (development headers)
ii  libsm6:amd64                         2:1.2.3-1build3                       amd64        X11 Session Management library
ii  libsmartcols1:amd64                  2.39.3-9ubuntu6.3                     amd64        smart column output alignment library
ii  libsodium23:amd64                    1.0.18-1build3                        amd64        Network communication, cryptography and signaturing library
ii  libsource-highlight-common           3.1.9-4.3build1                       all          architecture-independent files for source highlighting library
ii  libsource-highlight4t64:amd64        3.1.9-4.3build1                       amd64        source highlighting library
ii  libsqlite3-0:amd64                   3.45.1-1ubuntu2.5                     amd64        SQLite 3 shared library
ii  libsqlite3-dev:amd64                 3.45.1-1ubuntu2.5                     amd64        SQLite 3 development files
ii  libss2:amd64                         1.47.0-2.4~exp1ubuntu4.1              amd64        command-line interface parsing library
ii  libssh-4:amd64                       0.10.6-2ubuntu0.2                     amd64        tiny C SSH library (OpenSSL flavor)
ii  libssl-dev:amd64                     3.0.13-0ubuntu3.6                     amd64        Secure Sockets Layer toolkit - development files
ii  libssl3t64:amd64                     3.0.13-0ubuntu3.6                     amd64        Secure Sockets Layer toolkit - shared libraries
ii  libstdc++-13-dev:amd64               13.3.0-6ubuntu2~24.04                 amd64        GNU Standard C++ Library v3 (development files)
ii  libstdc++6:amd64                     14.2.0-4ubuntu2~24.04                 amd64        GNU Standard C++ Library v3
ii  libstemmer0d:amd64                   2.2.0-4build1                         amd64        Snowball stemming algorithms for use in Information Retrieval
ii  libsvtav1enc1d1:amd64                1.7.0+dfsg-2build1                    amd64        Scalable Video Technology for AV1 (libsvtav1enc shared library)
ii  libsystemd-shared:amd64              255.4-1ubuntu8.11                     amd64        systemd shared private library
ii  libsystemd0:amd64                    255.4-1ubuntu8.11                     amd64        systemd utility library
ii  libtasn1-6:amd64                     4.19.0-3ubuntu0.24.04.1               amd64        Manage ASN.1 structures (runtime)
ii  libthai-data                         0.1.29-2build1                        all          Data files for Thai language support library
ii  libthai0:amd64                       0.1.29-2build1                        amd64        Thai language support library
ii  libtiff6:amd64                       4.5.1+git230720-4ubuntu2.4            amd64        Tag Image File Format (TIFF) library
ii  libtinfo6:amd64                      6.4+20240113-1ubuntu2                 amd64        shared low-level terminfo library for terminal handling
ii  libtirpc-common                      1.3.4+ds-1.1build1                    all          transport-independent RPC library - common files
ii  libtirpc3t64:amd64                   1.3.4+ds-1.1build1                    amd64        transport-independent RPC library
ii  libtool                              2.4.7-7build1                         all          Generic library support script
ii  libtsan2:amd64                       14.2.0-4ubuntu2~24.04                 amd64        ThreadSanitizer -- a Valgrind-based detector of data races (runtime)
ii  libubsan1:amd64                      14.2.0-4ubuntu2~24.04                 amd64        UBSan -- undefined behaviour sanitizer (runtime)
ii  libudev1:amd64                       255.4-1ubuntu8.11                     amd64        libudev shared library
ii  libunistring5:amd64                  1.1-2build1.1                         amd64        Unicode string library for C
ii  libuno-cppu3t64                      4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- CPPU public library
ii  libuno-cppuhelpergcc3-3t64           4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- CPPU helper library
ii  libuno-purpenvhelpergcc3-3t64        4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- "purpose environment" helper
ii  libuno-sal3t64                       4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- SAL public library
ii  libuno-salhelpergcc3-3t64            4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- SAL helpers for C++ library
ii  libunwind8:amd64                     1.6.2-3build1.1                       amd64        library to determine the call-chain of a program - runtime
ii  libutempter0:amd64                   1.2.1-3build1                         amd64        privileged helper for utmp/wtmp updates (runtime)
ii  libuuid1:amd64                       2.39.3-9ubuntu6.3                     amd64        Universally Unique ID library
ii  libuv1t64:amd64                      1.48.0-1.1build1                      amd64        asynchronous event notification library - runtime library
ii  libvulkan1:amd64                     1.3.275.0-1build1                     amd64        Vulkan loader library
ii  libwayland-client0:amd64             1.22.0-2.1build1                      amd64        wayland compositor infrastructure - client library
ii  libwayland-cursor0:amd64             1.22.0-2.1build1                      amd64        wayland compositor infrastructure - cursor library
ii  libwayland-egl1:amd64                1.22.0-2.1build1                      amd64        wayland compositor infrastructure - EGL library
ii  libwayland-server0:amd64             1.22.0-2.1build1                      amd64        wayland compositor infrastructure - server library
ii  libwebp7:amd64                       1.3.2-0.4build3                       amd64        Lossy compression of digital photographic images
ii  libx11-6:amd64                       2:1.8.7-1build1                       amd64        X11 client-side library
ii  libx11-data                          2:1.8.7-1build1                       all          X11 client-side library
ii  libx11-dev:amd64                     2:1.8.7-1build1                       amd64        X11 client-side library (development headers)
ii  libx11-xcb1:amd64                    2:1.8.7-1build1                       amd64        Xlib/XCB interface library
ii  libxau-dev:amd64                     1:1.0.9-1build6                       amd64        X11 authorisation library (development headers)
ii  libxau6:amd64                        1:1.0.9-1build6                       amd64        X11 authorisation library
ii  libxaw7:amd64                        2:1.0.14-1build2                      amd64        X11 Athena Widget library
ii  libxcb-dri3-0:amd64                  1.15-1ubuntu2                         amd64        X C Binding, dri3 extension
ii  libxcb-glx0:amd64                    1.15-1ubuntu2                         amd64        X C Binding, glx extension
ii  libxcb-present0:amd64                1.15-1ubuntu2                         amd64        X C Binding, present extension
ii  libxcb-randr0:amd64                  1.15-1ubuntu2                         amd64        X C Binding, randr extension
ii  libxcb-render0:amd64                 1.15-1ubuntu2                         amd64        X C Binding, render extension
ii  libxcb-render0-dev:amd64             1.15-1ubuntu2                         amd64        X C Binding, render extension, development files
ii  libxcb-shm0:amd64                    1.15-1ubuntu2                         amd64        X C Binding, shm extension
ii  libxcb-shm0-dev:amd64                1.15-1ubuntu2                         amd64        X C Binding, shm extension, development files
ii  libxcb-sync1:amd64                   1.15-1ubuntu2                         amd64        X C Binding, sync extension
ii  libxcb-xfixes0:amd64                 1.15-1ubuntu2                         amd64        X C Binding, xfixes extension
ii  libxcb1:amd64                        1.15-1ubuntu2                         amd64        X C Binding
ii  libxcb1-dev:amd64                    1.15-1ubuntu2                         amd64        X C Binding, development files
ii  libxcomposite1:amd64                 1:0.4.5-1build3                       amd64        X11 Composite extension library
ii  libxcursor1:amd64                    1:1.2.1-1build1                       amd64        X cursor management library
ii  libxdamage1:amd64                    1:1.1.6-1build1                       amd64        X11 damaged region extension library
ii  libxdmcp-dev:amd64                   1:1.1.3-0ubuntu6                      amd64        X11 authorisation library (development headers)
ii  libxdmcp6:amd64                      1:1.1.3-0ubuntu6                      amd64        X11 Display Manager Control Protocol library
ii  libxext-dev:amd64                    2:1.3.4-1build2                       amd64        X11 miscellaneous extensions library (development headers)
ii  libxext6:amd64                       2:1.3.4-1build2                       amd64        X11 miscellaneous extension library
ii  libxfixes3:amd64                     1:6.0.0-2build1                       amd64        X11 miscellaneous 'fixes' extension library
ii  libxfont2:amd64                      1:2.0.6-1build1                       amd64        X11 font rasterisation library
ii  libxi6:amd64                         2:1.8.1-1build1                       amd64        X11 Input extension library
ii  libxinerama1:amd64                   2:1.1.4-3build1                       amd64        X11 Xinerama extension library
ii  libxkbcommon0:amd64                  1.6.0-1build1                         amd64        library interface to the XKB compiler - shared library
ii  libxkbfile1:amd64                    1:1.1.0-1build4                       amd64        X11 keyboard file manipulation library
ii  libxml2:amd64                        2.9.14+dfsg-1.3ubuntu3.6              amd64        GNOME XML library
ii  libxml2-utils                        2.9.14+dfsg-1.3ubuntu3.6              amd64        GNOME XML library - utilities
ii  libxmlb2:amd64                       0.3.18-1                              amd64        Binary XML library
ii  libxmlsec1t64:amd64                  1.2.39-5build2                        amd64        XML security library
ii  libxmlsec1t64-nss:amd64              1.2.39-5build2                        amd64        Nss engine for the XML security library
ii  libxmu6:amd64                        2:1.1.3-3build2                       amd64        X11 miscellaneous utility library
ii  libxmuu1:amd64                       2:1.1.3-3build2                       amd64        X11 miscellaneous micro-utility library
ii  libxpm4:amd64                        1:3.5.17-1build2                      amd64        X11 pixmap library
ii  libxrandr2:amd64                     2:1.5.2-2build1                       amd64        X11 RandR extension library
ii  libxrender-dev:amd64                 1:0.9.10-1.1build1                    amd64        X Rendering Extension client library (development files)
ii  libxrender1:amd64                    1:0.9.10-1.1build1                    amd64        X Rendering Extension client library
ii  libxshmfence1:amd64                  1.3-1build5                           amd64        X shared memory fences - shared library
ii  libxslt1.1:amd64                     1.1.39-0exp1ubuntu0.24.04.2           amd64        XSLT 1.0 processing library - runtime library
ii  libxt6t64:amd64                      1:1.2.1-1.2build1                     amd64        X11 toolkit intrinsics library
ii  libxtst6:amd64                       2:1.2.3-1.1build1                     amd64        X11 Testing -- Record extension library
ii  libxxf86vm1:amd64                    1:1.1.4-1build4                       amd64        X11 XFree86 video mode extension library
ii  libxxhash0:amd64                     0.8.2-2build1                         amd64        shared library for xxhash
ii  libyajl2:amd64                       2.1.0-5build1                         amd64        Yet Another JSON Library
ii  libyaml-0-2:amd64                    0.2.5-1build1                         amd64        Fast YAML 1.1 parser and emitter library
ii  libyaml-dev:amd64                    0.2.5-1build1                         amd64        Fast YAML 1.1 parser and emitter library (development)
ii  libyuv0:amd64                        0.0~git202401110.af6ac82-1            amd64        Library for YUV scaling (shared library)
ii  libzip4t64:amd64                     1.7.3-1.1ubuntu2                      amd64        library for reading, creating, and modifying zip archives (runtime)
ii  libzstd1:amd64                       1.5.5+dfsg2-2build1.1                 amd64        fast lossless compression algorithm
ii  linux-libc-dev:amd64                 6.8.0-87.88                           amd64        Linux Kernel Headers for development
ii  lld:amd64                            1:18.0-59~exp2                        amd64        LLVM-based linker
ii  lld-18                               1:18.1.3-1ubuntu1                     amd64        LLVM-based linker
ii  lldb:amd64                           1:18.0-59~exp2                        amd64        Next generation, high-performance debugger
ii  lldb-18                              1:18.1.3-1ubuntu1                     amd64        Next generation, high-performance debugger
ii  llvm                                 1:18.0-59~exp2                        amd64        Low-Level Virtual Machine (LLVM)
ii  llvm-18                              1:18.1.3-1ubuntu1                     amd64        Modular compiler and toolchain technologies
ii  llvm-18-linker-tools                 1:18.1.3-1ubuntu1                     amd64        Modular compiler and toolchain technologies - Plugins
ii  llvm-18-runtime                      1:18.1.3-1ubuntu1                     amd64        Modular compiler and toolchain technologies, IR interpreter
ii  llvm-runtime:amd64                   1:18.0-59~exp2                        amd64        Low-Level Virtual Machine (LLVM), bytecode interpreter
ii  locales                              2.39-0ubuntu8.6                       all          GNU C Library: National Language (locale) data [support]
ii  login                                1:4.13+dfsg1-4ubuntu3.2               amd64        system login tools
ii  logsave                              1.47.0-2.4~exp1ubuntu4.1              amd64        save the output of a command in a log file
ii  lsb-release                          12.0-2                                all          Linux Standard Base version reporting utility (minimal implementation)
ii  lsof                                 4.95.0-1build3                        amd64        utility to list open files
ii  lto-disabled-list                    47                                    all          list of packages not to build with LTO
ii  m4                                   1.4.19-4build1                        amd64        macro processing language
ii  make                                 4.3-4.1build2                         amd64        utility for directing compilation
ii  mawk                                 1.3.4.20240123-1build1                amd64        Pattern scanning and text processing language
ii  media-types                          10.1.0                                all          List of standard media types and their usual file extension
ii  mesa-libgallium:amd64                25.0.7-0ubuntu0.24.04.2               amd64        shared infrastructure for Mesa drivers
ii  mount                                2.39.3-9ubuntu6.3                     amd64        tools for mounting and manipulating filesystems
ii  nano                                 7.2-2ubuntu0.1                        amd64        small, friendly text editor inspired by Pico
ii  ncurses-base                         6.4+20240113-1ubuntu2                 all          basic terminal type definitions
ii  ncurses-bin                          6.4+20240113-1ubuntu2                 amd64        terminal-related programs and man pages
ii  netbase                              6.4                                   all          Basic TCP/IP networking system
ii  netcat-openbsd                       1.226-1ubuntu2                        amd64        TCP/IP swiss army knife
ii  ninja-build                          1.11.1-2                              amd64        small build system closest in spirit to Make
ii  openjdk-21-jdk:amd64                 21.0.8+9~us1-0ubuntu1~24.04.1         amd64        OpenJDK Development Kit (JDK)
ii  openjdk-21-jdk-headless:amd64        21.0.8+9~us1-0ubuntu1~24.04.1         amd64        OpenJDK Development Kit (JDK) (headless)
ii  openjdk-21-jre:amd64                 21.0.8+9~us1-0ubuntu1~24.04.1         amd64        OpenJDK Java runtime, using Hotspot JIT
ii  openjdk-21-jre-headless:amd64        21.0.8+9~us1-0ubuntu1~24.04.1         amd64        OpenJDK Java runtime, using Hotspot JIT (headless)
ii  openssl                              3.0.13-0ubuntu3.6                     amd64        Secure Sockets Layer toolkit - cryptographic utility
ii  packagekit                           1.2.8-2ubuntu1.2                      amd64        Provides a package management service
ii  passwd                               1:4.13+dfsg1-4ubuntu3.2               amd64        change and administer password and group data
ii  patch                                2.7.6-7build3                         amd64        Apply a diff file to an original
ii  perl                                 5.38.2-3.2ubuntu0.2                   amd64        Larry Wall's Practical Extraction and Report Language
ii  perl-base                            5.38.2-3.2ubuntu0.2                   amd64        minimal Perl system
ii  perl-modules-5.38                    5.38.2-3.2ubuntu0.2                   all          Core Perl modules
ii  php-common                           2:96+ubuntu24.04.1+deb.sury.org+1     all          Common files for PHP packages
ii  php8.4-cli                           8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        command-line interpreter for the PHP scripting language
ii  php8.4-common                        8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        documentation, examples and common module for PHP
ii  php8.4-curl                          8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        CURL module for PHP
ii  php8.4-dev                           8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        Files for PHP8.4 module development
ii  php8.4-gd                            8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        GD module for PHP
ii  php8.4-igbinary                      3.2.16-3+ubuntu24.04.1+deb.sury.org+1 amd64        igbinary PHP serializer
ii  php8.4-intl                          8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        Internationalisation module for PHP
ii  php8.4-mbstring                      8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        MBSTRING module for PHP
ii  php8.4-mysql                         8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        MySQL module for PHP
ii  php8.4-opcache                       8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        Zend OpCache module for PHP
ii  php8.4-pgsql                         8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        PostgreSQL module for PHP
ii  php8.4-readline                      8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        readline module for PHP
ii  php8.4-redis                         6.2.0-1+ubuntu24.04.1+deb.sury.org+1  amd64        PHP extension for interfacing with Redis
ii  php8.4-xml                           8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        DOM, SimpleXML, XML, and XSL module for PHP
ii  php8.4-zip                           8.4.14-1+ubuntu24.04.1+deb.sury.org+1 amd64        Zip module for PHP
ii  pinentry-curses                      1.2.1-3ubuntu5                        amd64        curses-based PIN or pass-phrase entry dialog for GnuPG
ii  pkg-config:amd64                     1.8.1-2build1                         amd64        manage compile and link flags for libraries (transitional package)
ii  pkgconf:amd64                        1.8.1-2build1                         amd64        manage compile and link flags for libraries
ii  pkgconf-bin                          1.8.1-2build1                         amd64        manage compile and link flags for libraries (binaries)
ii  polkitd                              124-2ubuntu1.24.04.2                  amd64        framework for managing administrative policies and privileges
ii  postgresql-16                        16.10-0ubuntu0.24.04.1                amd64        The World's Most Advanced Open Source Relational Database
ii  postgresql-client-16                 16.10-0ubuntu0.24.04.1                amd64        front-end programs for PostgreSQL 16
ii  postgresql-client-common             257build1.1                           all          manager for multiple PostgreSQL client versions
ii  postgresql-common                    257build1.1                           all          PostgreSQL database-cluster manager
ii  procps                               2:4.0.4-4ubuntu3.2                    amd64        /proc file system utilities
ii  psmisc                               23.7-1build1                          amd64        utilities that use the proc file system
ii  python-apt-common                    2.7.7ubuntu5                          all          Python interface to libapt-pkg (locales)
ii  python3                              3.12.3-0ubuntu2.1                     amd64        interactive high-level object-oriented language (default python3 version)
ii  python3-apt                          2.7.7ubuntu5                          amd64        Python 3 interface to libapt-pkg
ii  python3-argcomplete                  3.1.4-1ubuntu0.1                      all          bash tab completion for argparse (for Python 3)
ii  python3-blinker                      1.7.0-1                               all          Fast, simple object-to-object and broadcast signaling (Python3)
ii  python3-cffi-backend:amd64           1.16.0-2build1                        amd64        Foreign Function Interface for Python 3 calling C code - runtime
ii  python3-cryptography                 41.0.7-4ubuntu0.1                     amd64        Python library exposing cryptographic recipes and primitives (Python 3)
ii  python3-dbus                         1.3.2-5build3                         amd64        simple interprocess messaging system (Python 3 interface)
ii  python3-dev                          3.12.3-0ubuntu2.1                     amd64        header files and a static library for Python (default)
ii  python3-distro                       1.9.0-1                               all          Linux OS platform information API
ii  python3-gi                           3.48.2-1                              amd64        Python 3 bindings for gobject-introspection libraries
ii  python3-httplib2                     0.20.4-3                              all          comprehensive HTTP client library written for Python3
ii  python3-jwt                          2.7.0-1                               all          Python 3 implementation of JSON Web Token
ii  python3-launchpadlib                 1.11.0-6                              all          Launchpad web services client library (Python 3)
ii  python3-lazr.restfulclient           0.14.6-1                              all          client for lazr.restful-based web services (Python 3)
ii  python3-lazr.uri                     1.0.6-3                               all          library for parsing, manipulating, and generating URIs
ii  python3-lldb-18                      1:18.1.3-1ubuntu1                     amd64        Next generation, high-performance debugger, python3 lib
ii  python3-minimal                      3.12.3-0ubuntu2.1                     amd64        minimal subset of the Python language (default python3 version)
ii  python3-oauthlib                     3.2.2-1                               all          generic, spec-compliant implementation of OAuth for Python3
ii  python3-packaging                    24.0-1                                all          core utilities for python3 packages
ii  python3-pip                          24.0+dfsg-1ubuntu1.3                  all          Python package installer
ii  python3-pip-whl                      24.0+dfsg-1ubuntu1.3                  all          Python package installer (pip wheel)
ii  python3-pkg-resources                68.1.2-2ubuntu1.2                     all          Package Discovery and Resource Access using pkg_resources
ii  python3-pyparsing                    3.1.1-1                               all          alternative to creating and executing simple grammars - Python 3.x
ii  python3-setuptools                   68.1.2-2ubuntu1.2                     all          Python3 Distutils Enhancements
ii  python3-setuptools-whl               68.1.2-2ubuntu1.2                     all          Python Distutils Enhancements (wheel package)
ii  python3-six                          1.16.0-4                              all          Python 2 and 3 compatibility library
ii  python3-software-properties          0.99.49.3                             all          manage the repositories that you install software from
ii  python3-toml                         0.10.2-1                              all          library for Tom's Obvious, Minimal Language - Python 3.x
ii  python3-uno                          4:24.2.7-0ubuntu0.24.04.4             amd64        Python-UNO bridge
ii  python3-wadllib                      1.3.6-5                               all          Python 3 library for navigating WADL files
ii  python3-wheel                        0.42.0-2                              all          built-package format for Python
ii  python3-xmltodict                    0.13.0-1ubuntu0.24.04.1               all          Makes working with XML feel like you are working with JSON (Python 3)
ii  python3-yaml                         6.0.1-2build2                         amd64        YAML parser and emitter for Python3
ii  python3.10                           3.10.19-1+noble1                      amd64        Interactive high-level object-oriented language (version 3.10)
ii  python3.10-dev                       3.10.19-1+noble1                      amd64        Header files and a static library for Python (v3.10)
ii  python3.10-distutils                 3.10.19-1+noble1                      all          distutils package for Python (version 3.10)
ii  python3.10-lib2to3                   3.10.19-1+noble1                      all          lib2to3 package for Python (version 3.10)
ii  python3.10-minimal                   3.10.19-1+noble1                      amd64        Minimal subset of the Python language (version 3.10)
ii  python3.10-venv                      3.10.19-1+noble1                      amd64        Interactive high-level object-oriented language (pyvenv binary, version 3.10)
ii  python3.11                           3.11.14-1+noble1                      amd64        Interactive high-level object-oriented language (version 3.11)
ii  python3.11-dev                       3.11.14-1+noble1                      amd64        Header files and a static library for Python (v3.11)
ii  python3.11-distutils                 3.11.14-1+noble1                      all          distutils package for Python (version 3.11)
ii  python3.11-lib2to3                   3.11.14-1+noble1                      all          lib2to3 package for Python (version 3.11)
ii  python3.11-minimal                   3.11.14-1+noble1                      amd64        Minimal subset of the Python language (version 3.11)
ii  python3.11-venv                      3.11.14-1+noble1                      amd64        Interactive high-level object-oriented language (pyvenv binary, version 3.11)
ii  python3.12                           3.12.3-1ubuntu0.8                     amd64        Interactive high-level object-oriented language (version 3.12)
ii  python3.12-dev                       3.12.3-1ubuntu0.8                     amd64        Header files and a static library for Python (v3.12)
ii  python3.12-minimal                   3.12.3-1ubuntu0.8                     amd64        Minimal subset of the Python language (version 3.12)
ii  python3.12-venv                      3.12.3-1ubuntu0.8                     amd64        Interactive high-level object-oriented language (pyvenv binary, version 3.12)
ii  python3.13                           3.13.8-1+noble1                       amd64        Interactive high-level object-oriented language (version 3.13)
ii  python3.13-dev                       3.13.8-1+noble1                       amd64        Header files and a static library for Python (v3.13)
ii  python3.13-venv                      3.13.8-1+noble1                       amd64        Interactive high-level object-oriented language (pyvenv binary, version 3.13)
ii  readline-common                      8.2-4build1                           all          GNU readline and history libraries, common files
ii  redis-server                         5:7.0.15-1ubuntu0.24.04.2             amd64        Persistent key-value database with network interface
ii  redis-tools                          5:7.0.15-1ubuntu0.24.04.2             amd64        Persistent key-value database with network interface (client)
ii  ripgrep                              14.1.0-1                              amd64        Recursively searches directories for a regex pattern
ii  rpcsvc-proto                         1.4.2-0ubuntu7                        amd64        RPC protocol compiler and definitions
ii  sed                                  4.9-2build1                           amd64        GNU stream editor for filtering/transforming text
ii  sensible-utils                       0.0.22                                all          Utilities for sensible alternative selection
ii  sgml-base                            1.31                                  all          SGML infrastructure and SGML catalog file support
ii  shared-mime-info                     2.4-4                                 amd64        FreeDesktop.org shared MIME database and spec
ii  shtool                               2.0.8-10                              all          portable shell tool from the GNU project
ii  software-properties-common           0.99.49.3                             all          manage the repositories that you install software from (common)
ii  ssl-cert                             1.1.2ubuntu1                          all          simple debconf wrapper for OpenSSL
ii  strace                               6.8-0ubuntu2                          amd64        System call tracer
ii  sudo                                 1.9.15p5-3ubuntu5.24.04.1             amd64        Provide limited super user privileges to specific users
ii  systemd                              255.4-1ubuntu8.11                     amd64        system and service manager
ii  systemd-dev                          255.4-1ubuntu8.11                     all          systemd development files
ii  systemd-sysv                         255.4-1ubuntu8.11                     amd64        system and service manager - SysV compatibility symlinks
ii  sysvinit-utils                       3.08-6ubuntu3                         amd64        System-V-like utilities
ii  tar                                  1.35+dfsg-3build1                     amd64        GNU version of the tar archiving utility
ii  tmux                                 3.4-1ubuntu0.1                        amd64        terminal multiplexer
ii  tzdata                               2025b-0ubuntu0.24.04.1                all          time zone and daylight-saving time data
ii  ubuntu-keyring                       2023.11.28.1                          all          GnuPG keys of the Ubuntu archive
ii  ubuntu-mono                          24.04-0ubuntu1                        all          Ubuntu Mono Icon theme
ii  ucf                                  3.0043+nmu1                           all          Update Configuration File(s): preserve user changes to config files
ii  unminimize                           0.2.1                                 amd64        Un-minimize your minimial images or setup
ii  uno-libs-private                     4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment -- private libraries used by public ones
ii  unzip                                6.0-28ubuntu4.1                       amd64        De-archiver for .zip files
ii  ure                                  4:24.2.7-0ubuntu0.24.04.4             amd64        LibreOffice UNO runtime environment
ii  util-linux                           2.39.3-9ubuntu6.3                     amd64        miscellaneous system utilities
ii  uuid-dev:amd64                       2.39.3-9ubuntu6.3                     amd64        Universally Unique ID library - headers and static libraries
ii  valgrind                             1:3.22.0-0ubuntu3                     amd64        instrumentation framework for building dynamic analysis tools
ii  vim                                  2:9.1.0016-1ubuntu7.9                 amd64        Vi IMproved - enhanced vi editor
ii  vim-common                           2:9.1.0016-1ubuntu7.9                 all          Vi IMproved - Common files
ii  vim-runtime                          2:9.1.0016-1ubuntu7.9                 all          Vi IMproved - Runtime files
ii  wget                                 1.21.4-1ubuntu4.1                     amd64        retrieves files from the web
ii  x11-common                           1:7.7+23ubuntu3                       all          X Window System (X.Org) infrastructure
ii  x11-xkb-utils                        7.7+8build2                           amd64        X11 XKB utilities
ii  x11proto-core-dev                    2023.2-1                              all          transitional dummy package
ii  x11proto-dev                         2023.2-1                              all          X11 extension protocols and auxiliary headers
ii  xauth                                1:1.1.2-1build1                       amd64        X authentication utility
ii  xfonts-cyrillic                      1:1.0.5+nmu1                          all          Cyrillic fonts for X
ii  xfonts-encodings                     1:1.0.5-0ubuntu2                      all          Encodings for X.Org fonts
ii  xfonts-scalable                      1:1.0.3-1.3                           all          scalable fonts for X
ii  xfonts-utils                         1:7.7+6build3                         amd64        X Window System font utility programs
ii  xkb-data                             2.41-2ubuntu1.1                       all          X Keyboard Extension (XKB) configuration data
ii  xml-core                             0.19                                  all          XML infrastructure and XML catalog file support
ii  xorg-sgml-doctools                   1:1.11-1.1                            all          Common tools for building X.Org SGML documentation
ii  xserver-common                       2:21.1.12-1ubuntu1.5                  all          common files used by various X servers
ii  xtrans-dev                           1.4.0-1                               all          X transport library (development files)
ii  xvfb                                 2:21.1.12-1ubuntu1.5                  amd64        Virtual Framebuffer 'fake' X server
ii  xz-utils                             5.6.1+really5.4.5-1ubuntu0.2          amd64        XZ-format compression utilities
ii  yq                                   3.1.0-3                               all          Command-line YAML processor - jq wrapper for YAML documents
ii  zip                                  3.0-13ubuntu0.2                       amd64        Archiver for .zip files
ii  zlib1g:amd64                         1:1.3.dfsg-3.1ubuntu2.1               amd64        compression library - runtime
ii  zlib1g-dev:amd64                     1:1.3.dfsg-3.1ubuntu2.1               amd64        compression library - development
```

## Notable Package Categories

### Development Tools & Compilers
- build-essential - Meta-package for building Debian packages
- gcc, g++, cpp - GNU Compiler Collection (version 13)
- clang, clang-18 - LLVM C/C++ compiler
- cmake - Cross-platform build system
- make - GNU Make build automation
- autoconf, automake - GNU build system tools
- bison, flex - Parser and lexer generators
- ninja-build - Small build system focused on speed

### Programming Language Support
- python3, python3-pip - Python 3.11 with package manager
- nodejs (via /opt/node22) - JavaScript runtime
- openjdk-21-jdk - Java Development Kit
- golang (via /usr/local/go) - Go programming language
- ruby (via /opt/rbenv) - Ruby interpreter
- php - PHP interpreter
- rustc, cargo (via rustup) - Rust toolchain

### Version Control & SCM
- git - Distributed version control system
- git-lfs - Git Large File Storage
- subversion - Apache Subversion (SVN)
- mercurial - Distributed SCM

### Libraries & Development Headers
- libc6-dev - GNU C Library development files
- libssl-dev - OpenSSL development files
- libcurl4-openssl-dev - cURL development files
- zlib1g-dev - Compression library
- libpq-dev - PostgreSQL C client library
- libsqlite3-dev - SQLite 3 development files

### System Utilities
- curl, wget - HTTP/file download tools
- openssh-client - SSH client
- vim, nano - Text editors
- jq - JSON processor
- zip, unzip, tar, gzip - Archive utilities
- rsync - File synchronization tool

### Container & Virtualization Tools
- containerd - Container runtime
- runc - CLI tool for spawning containers

### Database Clients
- postgresql-client - PostgreSQL database client
- mysql-client - MySQL database client
- sqlite3 - SQLite command-line interface

### Network Tools
- curl, wget - Download utilities
- dnsutils - DNS query tools
- netcat-openbsd - TCP/IP swiss army knife
- ca-certificates - Common CA certificates

### Graphics & Fonts
- fontconfig - Font configuration library
- fonts-dejavu-core - DejaVu TrueType fonts
- libfreetype6 - FreeType 2 font engine
- xvfb - Virtual framebuffer X server

### Localization
- locales - GNU C Library locale data
- tzdata - Time zone and daylight-saving time data

---

## Query Commands

### Count installed packages
```bash
dpkg -l | grep ^ii | wc -l
```

### List all installed package names
```bash
dpkg -l | grep ^ii | awk '{print $2}'
```

### Search for a specific package
```bash
dpkg -l | grep <package-name>
```

### Get detailed package information
```bash
dpkg -s <package-name>
```

### List files installed by a package
```bash
dpkg -L <package-name>
```

### Find which package owns a file
```bash
dpkg -S /path/to/file
```

---

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')  
**Total Packages:** 675
