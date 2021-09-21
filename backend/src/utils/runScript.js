import {spawn} from 'child_process'
import dotenv from 'dotenv-defaults'

dotenv.config()

export const runRegistrationScript = (id) => {
    const python = spawn('python', ['./src/lib/MSI2Histology.py', '-ID', id]);
    python.stdout.on('data', function (data) {
        console.log(data.toString())
    });
    python.stderr.on('data', function (data) {
        console.log(data.toString())
    });
    //python.on('close', (code) => {
    //    console.log(`child process close all stdio with code ${code}`);})
}

export const runExtractionScript = (id) => {
    const python = spawn('python', ['./src/lib/extract_data_by_roi.py', '-ID', id]);
    python.stdout.on('data', function (data) {
        console.log(data.toString())
    });
    python.stderr.on('data', function (data) {
        console.log(data.toString())
    });
    //python.on('close', (code) => {
    //    console.log(`child process close all stdio with code ${code}`);})
}

export const runDrawROIScript = (id) => {
    const python = spawn('python', ['./src/lib/draw_mask_from_roi.py', '-ID', id]);
    python.stdout.on('data', function (data) {
        console.log(data.toString())
    });
    python.stderr.on('data', function (data) {
        console.log(data.toString())
    });
    //python.on('close', (code) => {
    //    console.log(`child process close all stdio with code ${code}`);})
}

export const activatePyvevn = () => {
    /*const venv = spawn('powershell.exe',[process.env.PYVENV_ACTIVATE_PATH])
    venv.stdout.on('data', function (data) {
        console.log('success')
        console.log(data.toString())
    });
    venv.stderr.on('data', function (data) {
        console.log('error')
        console.log(data.toString())
    });
    venv.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);})*/
    const python = spawn('python', ['./src/lib/test.py']);
    python.stdout.on('data', function (data) {
            console.log(data.toString())
        });
    python.stderr.on('data', function (data) {
            console.log(data.toString())
        });
    python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);}) 
}
