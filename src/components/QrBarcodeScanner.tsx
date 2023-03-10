import {useEffect} from "react";
import {Html5QrcodeScanner} from "html5-qrcode";
import {Html5QrcodeResult} from "html5-qrcode/esm/core";
import {Box, Button, useTheme} from "@mui/material";
import {tokens} from "../theme";

interface QrBarcodeScannerProps {
    onQrFound: (qr: string) => void;
    onBarcodeFound: (barcode: string) => void;
    onManualInputClick: () => void;
}

const QrBarcodeScanner = ({ onQrFound, onBarcodeFound, onManualInputClick }: QrBarcodeScannerProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const qrCodeRegionId = "html5qr-code-full-region";

    const config = {
        fps: 30,
        qrbox: 250,
        disableFlip: false
    };

    const onSuccess = (decodedText: string, decodedResult: Html5QrcodeResult) => {
        if (decodedResult.result.format?.formatName === "QR_CODE") {
            onQrFound(decodedText);
            return;
        }

        onBarcodeFound(decodedText);
    };

    useEffect(() => {
        let scanner = new Html5QrcodeScanner(qrCodeRegionId, config, false);
        scanner.render(onSuccess, undefined);
        return () => { scanner?.clear().catch(console.error); }
    }, []);

    return (
        <Box>
            <Box id={qrCodeRegionId}>{}</Box> {/* DIV MUST CONTAIN SOMETHING SO IT IS NOT REMOVED */}
            <Box display="flex" justifyContent="center" mt="20px">
                <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    sx={{width: "100%", fontSize: "0.9rem"}}
                    onClick={onManualInputClick}
                >
                    Ingresar Manualmente
                </Button>
            </Box>
        </Box>
    );
};

export default QrBarcodeScanner;