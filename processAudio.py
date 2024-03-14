
import pydub 
import sys
import shutil

# pydub.AudioSegment.ffmpeg = 'C:/Users/LAURA-PC/Desktop/3kursas/Intelektika/Lab1/test/ffmpeg-6.1.1-full_build/bin/ffmpeg.exe'

def apply_panning(audio_path, pan):
    # Įkelti garso failą
    audio = pydub.AudioSegment.from_file(audio_path)

    # Pritaikyti panning efektą
    # Pavyzdžiui, pritaikome panning į dešinę per 25%
    audio = audio.pan(float(pan))
    output_path = 'public/audio/panned_audio.wav'
    # shutil.copyfile(audio, output_path)
    # Išsaugoti naują garso failą
    
    audio.export(output_path, format='wav')

    return output_path

if __name__ == "__main__":
    # Gavus garso failo kelią iš argumentų
    audio_file_path = sys.argv[1]
    pan = sys.argv[2]

    # Pritaikyti panning efektą
    panned_audio_path = apply_panning(audio_file_path, pan)

    # Siųsti atgal naują garso failą į tėvo procesą
    sys.stdout.buffer.write(open(panned_audio_path, 'rb').read())