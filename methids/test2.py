
# from pydub import AudioSegment

# def panning(audio_path, pan):
#     sound = AudioSegment.from_file(audio_path)
    
#     # Garso panningas: -1 kairėje, 1 dešinėje, 0 centrui
#     sound = sound.pan(pan)
    
#     # Išsaugome naują garso failą
#     output_path = "panned_audio.wav"
#     sound.export(output_path, format="wav")

# if __name__ == "__main__":
#     audio_file = "guitar.wav"  # Keiskite į savo garso failo pavadinimą
#     pan_amount = -1  # Keiskite šį skaičių, kad nustatytumėte panningo kiekį
#     panning(audio_file, pan_amount)


# from pydub import AudioSegment
# import sys
# import io

# def panning(pan):
#     sound = AudioSegment.from_file("guitar.wav")
    
#     # Garso panningas
#     sound = sound.pan(float(pan))
    
#     # # Išsaugome naują garso failą
#     # output_path = "panned_audio.wav"
#     # sound.export(output_path, format="wav")
#     # return output_path
    
#     # Į laikinąją atmintį įrašome garso įrašo duomenis
#     output_buffer = io.BytesIO()
#     sound.export(output_buffer, format="mp3")
    
#     # Grąžiname garso įrašo duomenis kaip masyvą
#     return output_buffer.getvalue()

# if __name__ == "__main__":
#     # pan = sys.argv[1]  # Gauname panoramos parametrą iš komandinės eilutės
#     pan = 1  # Gauname panoramos parametrą iš komandinės eilutės
#     # print(panning(pan))
#     result = panning(pan)
#     sys.stdout.buffer.write(result)
#     # print('55')



# import sys
# import shutil

# def process_audio(input_file, output_file):
#     # Šiame etape gali būti bet koks garso failo apdorojimas
#     # Šiuo atveju tiesiog kopijuojame įvesties failą į išvesties failą
#     shutil.copyfile(input_file, output_file)

# if __name__ == "__main__":
#     # Paimkite pateiktą garso failo kelią iš argumentų
#     audio_file_path = sys.argv[1]

#     # Proceso garso failo apdorojimas
#     output_audio_file_path = 'processed_audio.wav'
#     process_audio(audio_file_path, output_audio_file_path)

#     # Siųsti apdorotą garso failą į tėvo procesą
#     sys.stdout.buffer.write(open(output_audio_file_path, 'rb').read())


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
    output_path = 'panned_audio.wav'
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

