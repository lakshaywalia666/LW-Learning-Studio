"""Regenerate native build tool paths after moving the project; no downloads."""
import argparse
import json
import os
import pathlib
import platform
import shutil

root = pathlib.Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--sdk', type=pathlib.Path)
parser.add_argument('--java-home', type=pathlib.Path)
parser.add_argument('--android-jar', type=pathlib.Path, help='Use a separate Android platform 35 JAR.')
parser.add_argument('--output', type=pathlib.Path, default=root/'work/android-toolchain/paths.json')
args = parser.parse_args()
bundled = root/'work/android-toolchain'
can_use_bundle = platform.system() == 'Darwin' and platform.machine() in ('arm64', 'aarch64')
sdk = args.sdk or (pathlib.Path(os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT')) if os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT') else None)
if sdk is None and can_use_bundle:
    sdk = bundled
if sdk is None:
    raise SystemExit('Set --sdk or ANDROID_HOME to an Android SDK for this OS. The preserved toolchain is macOS ARM only.')
sdk = sdk.expanduser().resolve()
java_home = args.java_home or (pathlib.Path(os.environ['JAVA_HOME']) if os.environ.get('JAVA_HOME') else None)
if java_home is None and can_use_bundle:
    candidates = sorted((bundled/'jdk').glob('*/Contents/Home/bin/javac'))
    if candidates:
        java_home = candidates[0].parent.parent
if java_home is None and shutil.which('javac'):
    java_home = pathlib.Path(shutil.which('javac')).resolve().parent.parent
if java_home is None:
    raise SystemExit('Set --java-home or JAVA_HOME to a JDK 17 installation.')
java_home = java_home.expanduser().resolve()

def first(paths, label):
    for path in paths:
        if path.is_file():
            return path.resolve()
    raise SystemExit('Could not find '+label+'. Install platform 35/build-tools 35.0.0 and a JDK 17 for this OS.')

suffix = '.exe' if os.name == 'nt' else ''
tools = {name: first([java_home/'bin'/(name+suffix)], name) for name in ['java', 'javac', 'keytool', 'jar']}
platform_jars = [args.android_jar.expanduser()] if args.android_jar else [
    sdk/'platforms/android-35/android.jar', sdk/'platform/android-35/android.jar'
]
tools['android_jar'] = first(platform_jars, 'Android platform 35')
build_dirs = [sdk/'build-tools/35.0.0', sdk/'build-tools/android-15']
for name in ['aapt2', 'd8', 'zipalign', 'apksigner']:
    extensions = ['.bat', '.exe', ''] if os.name == 'nt' else ['']
    tools[name] = first([folder/(name+ext) for folder in build_dirs for ext in extensions], name)
for name in ['d8', 'apksigner']:
    tools[name+'_jar'] = first([folder/'lib'/(name+'.jar') for folder in build_dirs], name+' JAR')
adb = sdk/'platform-tools'/('adb'+suffix)
if adb.is_file():
    tools['adb'] = adb.resolve()
if os.name != 'nt':
    for name, path in tools.items():
        if path.suffix != '.jar' and not os.access(path, os.X_OK):
            path.chmod(path.stat().st_mode | 0o100)
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps({key: str(value) for key, value in tools.items()}, indent=2)+'\n')
print('Configured '+str(args.output.resolve()))
print('JDK: '+str(java_home))
print('SDK: '+str(sdk))
