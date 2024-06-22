document.documentElement.classList.add("hasJS");

      function highlightTextarea() {
        var textarea = document.getElementById("input");
        textarea.classList.add("highlight-border");

        setTimeout(function() {
          textarea.classList.remove("highlight-border");
        }, 1000); // Remove the class after 1 second (adjust timing as needed)
      }

      function button1() {
        clearErrors();

        var input = document.getElementById("input").value;

        try {
          document.getElementById("output").value = toOutput(input);
        } catch (error) {
          var errorMessage = error.message;
          document.getElementById("input").setCustomValidity(errorMessage);
          document.getElementById("inputerror").innerHTML = errorMessage;
        }
      }

      function clearErrors() {
        document.getElementById("input").setCustomValidity("");
        document.getElementById("inputerror").innerHTML = null;
        document.getElementById("output").setCustomValidity("");
        document.getElementById("outputerror").innerHTML = null;
      }

      function button2() {
        clearErrors();

        var output = document.getElementById("output").value;

        try {
          document.getElementById("input").value = toInput(output);
        } catch (error) {
          var errorMessage = error.message;
          document.getElementById("output").setCustomValidity(errorMessage);
          document.getElementById("outputerror").innerHTML = errorMessage;
        }
      }

      function toOutput(input) {
        var uncompressedLengthField =
          document.getElementById("uncompressedlength");
        var compressedLengthField = document.getElementById("compressedlength");
        var lengthDifferenceField = document.getElementById("lengthdifference");

        //clear info fields
        uncompressedLengthField.innerHTML = "Uncompressed length: ";
        compressedLengthField.innerHTML = "Compressed length: ";
        lengthDifferenceField.innerHTML = "Length difference: ";

        //select the compression format

        var result;
        result = textToGzip(input);

        //update info fields
        uncompressedLengthField.innerHTML =
          "Uncompressed length: " + input.length + " characters";
        compressedLengthField.innerHTML =
          "Compressed length: " + result.length + " characters";
        lengthDifferenceField.innerHTML =
          "Length difference: " +
          (input.length - result.length) +
          " characters";

        return result;
      }

      function toInput(output) {
        var uncompressedLengthField =
          document.getElementById("uncompressedlength");
        var compressedLengthField = document.getElementById("compressedlength");
        var lengthDifferenceField = document.getElementById("lengthdifference");

        //clear info fields
        uncompressedLengthField.innerHTML = "Uncompressed length: ";
        compressedLengthField.innerHTML = "Compressed length: ";
        lengthDifferenceField.innerHTML = "Length difference: ";

        //select the compression format

        var result;
        result = gzipToText(output);

        //update info fields
        uncompressedLengthField.innerHTML =
          "Uncompressed length: " + result.length + " characters";
        compressedLengthField.innerHTML =
          "Compressed length: " + output.length + " characters";
        lengthDifferenceField.innerHTML =
          "Length difference: " +
          (result.length - output.length) +
          " characters";

        return result;
      }

      function textToGzip(input) {
        try {
          var uint8Array = pako.gzip(input);
          var stringValue = uint8ToString(uint8Array);
          return btoa(stringValue);
        } catch (error) {
          if (error.name === "InvalidCharacterError") {
            throw new Error(
              "Invalid character in text to be encoded into GZIP."
            );
          } else {
            throw new Error("Cannot encode text into GZIP.");
          }
        }
      }

      function gzipToText(input) {
        try {
          var stringValue = atob(input.trim());
          var charArray = stringValue.split("").map(function (x) {
            return x.charCodeAt(0);
          });
          return pako.ungzip(charArray, { to: "string" });
        } catch (error) {
          throw new Error("Value is not a valid GZIP compressed text.");
        }
      }

      function uint8ToString(uint8Value) {
        var bufferSize = 0x8000;
        var c = [];
        for (var i = 0; i < uint8Value.length; i += bufferSize) {
          c.push(
            String.fromCharCode.apply(
              null,
              uint8Value.subarray(i, i + bufferSize)
            )
          );
        }
        return c.join("");
      }

      function encode() {
        var obj = document.getElementById("dencoder");
        var unencoded = obj.value;
        obj.value = encodeURIComponent(unencoded)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");
      }
      function decode() {
        var obj = document.getElementById("dencoder");
        var encoded = obj.value;
        obj.value = decodeURIComponent(encoded.replace(/\+/g, " "));
      }