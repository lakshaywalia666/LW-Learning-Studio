"""Build a signed, offline Android APK with Android SDK build-tools and JDK 17.

Usage: python3 build_android.py --tools /absolute/path/to/toolchain-paths.json
The JSON has java, javac, keytool, android_jar, aapt2, d8, zipalign, apksigner.
"""
import argparse, json, os, pathlib, shutil, subprocess, zipfile
parser=argparse.ArgumentParser();parser.add_argument('--tools',required=True);parser.add_argument('--output');parser.add_argument('--build-dir');args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent;tools=json.loads(pathlib.Path(args.tools).read_text());native=root/'android';build=pathlib.Path(args.build_dir).resolve() if args.build_dir else root/'build/android'
if build.exists():shutil.rmtree(build)
for folder in ['gen','classes','dex']:(build/folder).mkdir(parents=True,exist_ok=True)
env=os.environ.copy();env['JAVA_HOME']=str(pathlib.Path(tools['java']).resolve().parents[1]);env['ANDROID_USER_HOME']=str(build/'android-user')
def run(arguments):
    result=subprocess.run([str(v) for v in arguments],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    if result.returncode:raise RuntimeError('Command failed: '+str(arguments[0])+'\n'+result.stdout)
    if result.stdout.strip():print(result.stdout.strip(),flush=True)
run([tools['aapt2'],'compile','--dir',native/'res','-o',build/'resources.zip'])
run([tools['aapt2'],'link','-o',build/'resources.apk','-I',tools['android_jar'],'--manifest',native/'AndroidManifest.xml','--java',build/'gen','-A',root/'public',build/'resources.zip'])
sources=[*list((native/'src').rglob('*.java')),*list((build/'gen').rglob('*.java'))]
run([tools['javac'],'-encoding','UTF-8','-source','11','-target','11','-classpath',tools['android_jar'],'-d',build/'classes',*sources])
classes=list((build/'classes').rglob('*.class'))
run([tools['d8'],'--lib',tools['android_jar'],'--min-api','26','--output',build/'dex',*classes])
unsigned=build/'unsigned.apk';shutil.copy2(build/'resources.apk',unsigned)
with zipfile.ZipFile(unsigned,'a',zipfile.ZIP_DEFLATED)as archive:
    for file in (build/'dex').glob('*.dex'):archive.write(file,file.name)
run([tools['zipalign'],'-f','4',unsigned,build/'aligned.apk'])
signing=native/'signing';signing.mkdir(exist_ok=True);key=signing/'development.keystore'
if not key.exists():run([tools['keytool'],'-genkeypair','-keystore',key,'-storepass','android','-keypass','android','-alias','skillgrove','-keyalg','RSA','-keysize','2048','-validity','10000','-dname','CN=Skillgrove Local Development, OU=Personal, O=Skillgrove, C=IN'])
output=pathlib.Path(args.output).resolve()if args.output else root.parent/'LW-Learning-Studio.apk'
run([tools['apksigner'],'sign','--ks',key,'--ks-key-alias','skillgrove','--ks-pass','pass:android','--key-pass','pass:android','--out',output,build/'aligned.apk'])
run([tools['apksigner'],'verify','--verbose','--print-certs',output])
run([tools['aapt2'],'dump','badging',output])
print(json.dumps({'apk':str(output),'bytes':output.stat().st_size,'minimum_android':'8.0','package':'com.cyberpath.learning'},indent=2))
