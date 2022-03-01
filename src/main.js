window.addEventListener("load", () => {
	const selectBox = document.getElementById("sMidiControllers");
	let selectedOutput = null;
	let allOutputs = [];

	const createError = (error) => {
		const errorsContainer = document.getElementById("dErrors");
		const errorDiv = document.createElement("div");
		var textNode = document.createTextNode(error);
		errorDiv.classList.add("notification");
		errorDiv.classList.add("is-danger");
		errorDiv.appendChild(textNode);
		errorsContainer.appendChild(errorDiv);
	}

	if (navigator.requestMIDIAccess) {

		navigator.requestMIDIAccess()
			.then(access => {

				// Get lists of available MIDI controllers
				allOutputs = Array.from(access.outputs.values());
				allInputs = Array.from(access.inputs.values());

				if (allOutputs.length == 0) {
					createError("Error: no MIDI controllers were found. Please connect one and refresh the page.");

				} else {
					for (const output of allOutputs) {
						const option = document.createElement("option");
						option.value = output.id;
						option.text = output.name;
						selectBox.appendChild(option);
					}
					// auto-select an Icon Keyboard
					const iconKeyboard = allOutputs.find(x => x.manufacturer === "iCON");
					if (iconKeyboard) {
						selectedOutput = iconKeyboard;
						selectBox.value = iconKeyboard.id;
					} else {
						selectedOutput = allOutputs[0];
					}

					document.getElementById("dMain").style.display = "block";
				}

				access.onstatechange = (e) => {
					// Print information about the (dis)connected MIDI controller
					console.log(e.port.name, e.port.manufacturer, e.port.state);
				};
			});

		selectBox.addEventListener("change", (ev) => {
			const selectedId = ev.target.value;
			selectedOutput = allOutputs.find(x => x.id === selectedId);
		});

		const testButton = document.getElementById("bSendMessage");
		testButton.addEventListener("click", (ev) => {
			const ccTo127 = [0xB0, 0x07, 127];
			selectedOutput.send(ccTo127);
		});


	} else {
		createError("This test requires WebMIDI access, which is currently only available in Chrome, Edge and Opera.")
	}

	const pLoading = document.getElementById("pLoading");
	pLoading.remove();
});