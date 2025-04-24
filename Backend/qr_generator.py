import segno
import tkinter as tk
from tkinter import simpledialog, messagebox
from PIL import Image, ImageTk
import os

class StellarQRGenerator:
    def __init__(self):
        self.root = tk.Tk()
        self.root.withdraw()  # Hide the main window
        self.img_tk = None  # To maintain image reference

    def show_address_dialog(self):
        """Display popup to enter Stellar address"""
        while True:
            address = simpledialog.askstring(
                "Stellar Address Input",
                "Enter your Stellar wallet address (starts with G):",
                parent=self.root
            )
            
            if address is None:  # User clicked cancel
                return
            
            if self.validate_address(address):
                if self.generate_qr(address):
                    self.show_qr_preview()
                return
            else:
                messagebox.showerror("Invalid Address", "Please enter a valid Stellar address starting with 'G'")

    def validate_address(self, address):
        """Basic Stellar address validation"""
        return address.startswith('G') and len(address) == 56

    def generate_qr(self, address):
        """Generate wallet-compatible URI QR"""
        try:
            stellar_uri = f"stellar:{address}?network=testnet"
            segno.make(stellar_uri, error='h').save(
                "public_stellar_uri_qr.png",
                scale=10,
                dark="#0B0D2B",
                light="#FFFFFF",
                border=2
            )
            return True
        except Exception as e:
            messagebox.showerror("Generation Error", f"Failed to generate QR: {str(e)}")
            return False

    def show_qr_preview(self):
        """Display the generated QR in a preview window"""
        if not os.path.exists("public_stellar_uri_qr.png"):
            messagebox.showerror("Error", "QR file not found")
            return
            
        preview = tk.Toplevel()
        preview.title("Generated Stellar QR Code")
        
        try:
            img = Image.open("public_stellar_uri_qr.png")
            self.img_tk = ImageTk.PhotoImage(img)  # Maintain reference
            
            label = tk.Label(preview, image=self.img_tk)
            label.pack()
            
            tk.Label(preview, text="Scan this with your Stellar wallet").pack()
            tk.Button(preview, text="Close", command=preview.destroy).pack()
            
            # Center the window
            preview.update_idletasks()
            width = preview.winfo_width()
            height = preview.winfo_height()
            x = (preview.winfo_screenwidth() // 2) - (width // 2)
            y = (preview.winfo_screenheight() // 2) - (height // 2)
            preview.geometry(f'+{x}+{y}')
            
        except Exception as e:
            messagebox.showerror("Preview Error", f"Cannot display QR: {str(e)}")
            preview.destroy()

if __name__ == "__main__":
    app = StellarQRGenerator()
    app.show_address_dialog()
    app.root.destroy()  # Clean up Tkinter