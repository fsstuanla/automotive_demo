var xml_data = []
xml_data['abs-pcm.xml'] = `<metadata><timestamp>2023-03-02T21:27:04Z</timestamp><modules><module><vendor>Bosch</vendor><name>ABS</name><version>3.1</version><hashes><hash alg="SHA-384">aff816bf691e4490d4e977386c21abaceb97b7ce502d88c35c52cfdb7a7e50310ecc70019582d8247a99626bc98ad16b</hash></hashes></module><module><vendor>Bosch</vendor><name>PCM</name><version>5.0</version><hashes><hash alg="SHA-384">aff816bf691e4490d4e977386c21abaceb97b7ce502d88c35c52cfdb7a7e50310ecc70019582d8247a99626bc98ad16b</hash></hashes></module><module><vendor>Continental</vendor><name>BCM</name><version>2.2</version><hashes><hash alg="SHA-384">aff816bf691e4490d4e977386c21abaceb97b7ce502d88c35c52cfdb7a7e50310ecc70019582d8247a99626bc98ad16b</hash></hashes></module></modules><component bom-ref="pkg:bosch/abs-firmware@12345678" type="firmware"><name>abs-firmware</name><version>12345678</version><scope>required</scope></component><component bom-ref="pkg:bosch/pcm-firmware@23456789" type="firmware"><name>pcm-firmware</name><version>23456789</version><scope>required</scope></component><component bom-ref="pkg:continental/bcm-firmware@12347778" type="firmware"><name>bcm-firmware</name><version>12347778</version><scope>required</scope></component></metadata>`
xml_data['adas-version.xml'] = `<metadata>
        <timestamp>2023-03-02T21:27:04Z</timestamp>
        <modules>
            <module>
                <vendor>Aptiv</vendor>
                <name>ADAS</name>
                <version>2.0</version>
                <hashes>
                    <hash alg="SHA-384">aff816bf691e4490d4e977386c21abaceb97b7ce502d88c35c52cfdb7a7e50310ecc70019582d8247a99626bc98ad16b</hash>
                </hashes>
            </module>
        </modules>
        <component bom-ref="pkg:aptiv/adas-parent@1.3.15" type="firmware">
            <name>adas-firmware</name>
            <version>1.3.15</version>
            <scope>required</scope>
        </component>
</metadata>
`
xml_data['request.xml'] = `<xml><currloc><lat>10.12</lat><long>12.35</long></currloc><msg>drowsiness</msg></xml>`
// console.log(Object.keys(xml_data));
// Object.keys((xml_data)).forEach(function () {
//     console.log(xml_data['xml']);
// });
for (const [key, value] of Object.entries(xml_data)) {
    $('#xml_data').append(`<option value=${key}>${key}</option>`)
}
// var xml_data = 'bbbb'