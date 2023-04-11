var xml_data = []
xml_data['response.xml'] = `<xml><loc><lat>11.21</lat><long>13.15</long></loc><coffee><unitprice>$1</unitprice><item>cup</item></coffee><msg>Coffee shop near by</msg></xml>`
xml_data['hostalias.xml'] = `<services version="1.0"><content id="music" version="1.0"><redundancy>2</redundancy><nodes><node hostalias="node0"/><node hostalias="node1"/></nodes><documents><document type="music"/></documents></content></services>`
xml_data['vespa.xml'] = `<container id="default" version="1.0"><handler id="com.yahoo.vespatest.ConfiguredHandler"><config name="vespatest.response"><response>configured string</response></config></handler><nodes><node hostalias="node0"/></nodes></container>`
xml_data['cluster.xml'] = `<routing version="1.0"><routingtable protocol="document"><hop name="hop1" selector="docproc/cluster.foo/docproc/*/feed-processor"><recipient session="docproc/cluster.foo/docproc/*/feed-processor" /></hop></routingtable><services protocol="document"><service name="foo/bar" /></services></routing>`

for (const [key, value] of Object.entries(xml_data)) {
    $('#xml_data').append(`<option value=${key}>${key}</option>`)
}
