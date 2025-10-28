// FIX: Add Web Serial API type definitions to resolve TypeScript errors.
// These types are not always included in default TypeScript DOM library files.
declare global {
  interface SerialPort extends EventTarget {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<Uint8Array>;
  }

  interface SerialConnectionEvent extends Event {
    readonly port: SerialPort;
  }

  interface Serial extends EventTarget {
    requestPort(options?: any): Promise<SerialPort>;
    addEventListener(
      type: 'disconnect',
      listener: (this: this, ev: SerialConnectionEvent) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
    ): void;
  }

  interface Navigator {
    serial: Serial;
  }
}

import { ConnectionStatus, SensorData } from '../types';

// Module-level state to manage the connection
let port: SerialPort | undefined;
let reader: ReadableStreamDefaultReader<string> | undefined;
let keepReading = true;

/**
 * Service object for handling Web Serial API communication.
 */
const webSerialService = {
  /**
   * Connects to a serial device, opens the port, and starts reading data.
   * @param onData - Callback function to handle incoming parsed sensor data.
   * @param onStatusChange - Callback function to report changes in connection status.
   */
  async connect(
    onData: (data: SensorData) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ): Promise<void> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API is not supported by this browser.');
    }

    try {
      // Prompt user to select a serial port
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 }); // A common default baud rate

      // Listen for the device being physically disconnected
      navigator.serial.addEventListener('disconnect', (event) => {
        if (event.port === port) {
          console.log('Device disconnected.');
          this.disconnect();
          onStatusChange('disconnected');
        }
      });
      
      keepReading = true;
      this.startReading(port, onData);

    } catch (error) {
      onStatusChange('disconnected');
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        // This error is thrown if the user cancels the port selection dialog.
        console.log('User cancelled port selection.');
        // We re-throw it so the App component knows not to show a generic error message.
        throw error;
      } else {
        console.error('Error connecting to serial port:', error);
        throw new Error('Failed to open serial port.');
      }
    }
  },

  /**
   * Starts a loop to continuously read data from the provided port.
   * @param port - The active SerialPort to read from.
   * @param onData - The callback to execute with parsed data.
   */
  async startReading(port: SerialPort, onData: (data: SensorData) => void): Promise<void> {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();
    
    let buffer = '';

    while (port.readable && keepReading) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          break; // Reader has been canceled
        }
        
        buffer += value;
        
        // Process buffer line by line, assuming newline-delimited JSON
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            try {
              const jsonData: SensorData = JSON.parse(line);
              onData(jsonData);
            } catch (e) {
              console.warn('Could not parse JSON from serial data:', line);
            }
          }
        }
      } catch (error) {
        console.error('Error reading from serial port:', error);
        break; // Exit loop on error
      }
    }

    // When the loop finishes, close associated resources
    await readableStreamClosed.catch(() => { /* Ignore errors */ });
    if(reader) reader.releaseLock();
  },

  /**
   * Disconnects from the serial port and cleans up resources.
   */
  async disconnect(): Promise<void> {
    keepReading = false;
    
    if (reader) {
      try {
        await reader.cancel();
      } catch (error) {
        // Ignore cancel errors
      }
      reader = undefined;
    }

    if (port) {
      try {
        await port.close();
      } catch (error) {
        console.error("Error closing port:", error);
      }
      port = undefined;
    }
  },
};

export default webSerialService;
