RM = rm -f

STSOUND_SRC=StSound-1.43/StSoundLibrary

LIB = digidrum.o Ymload.o Ym2149Ex.o YmMusic.o YmUserInterface.o

CFLAGS = -Wall

libym.js: libym.a
	$(CC) -o libym.js libym.a -L. -llzh -s EXPORTED_FUNCTIONS='["_ymMusicCreate", "_ymMusicDestroy", "_ymMusicLoad", "_ymMusicLoadMemory", "_ymMusicGetInfo", "_ymMusicPlay", "_ymMusicCompute", "_ymMusicStop", "_ymMusicGetLastError"]' -s MODULARIZE=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "getValue"]'

libym.a: $(LIB)
	$(AR) cr libym.a $(LIB)

digidrum.o: $(STSOUND_SRC)/digidrum.cpp $(STSOUND_SRC)/YmTypes.h
	$(CC) -c $(STSOUND_SRC)/digidrum.cpp

Ym2149Ex.o: $(STSOUND_SRC)/Ym2149Ex.cpp $(STSOUND_SRC)/Ym2149Ex.h $(STSOUND_SRC)/YmTypes.h
	$(CC) -c $(STSOUND_SRC)/Ym2149Ex.cpp

Ymload.o: $(STSOUND_SRC)/Ymload.cpp $(STSOUND_SRC)/YmMusic.h $(STSOUND_SRC)/LZH/LZH.H liblzh.a
	$(CC) -c $(STSOUND_SRC)/Ymload.cpp

YmMusic.o: $(STSOUND_SRC)/YmMusic.cpp $(STSOUND_SRC)/YmMusic.h
	$(CC) -c $(STSOUND_SRC)/YmMusic.cpp

YmUserInterface.o: $(STSOUND_SRC)/YmUserInterface.cpp $(STSOUND_SRC)/StSoundLibrary.h $(STSOUND_SRC)/YmMusic.h
	$(CC) -c $(STSOUND_SRC)/YmUserInterface.cpp

liblzh.a: lzhlib.o
	$(AR) cr liblzh.a LzhLib.o

lzhlib.o: $(STSOUND_SRC)/LZH/LzhLib.cpp $(STSOUND_SRC)/LZH/LZH.H
	$(CC) -c $(STSOUND_SRC)/LZH/LzhLib.cpp

clean:
	$(RM) *~ *.o *.a *.js
