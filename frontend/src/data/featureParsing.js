export function getFeatureAdminLevel(feature) {
    let admin_level;

    if (Object.keys(feature.properties).includes("adm3_id")) admin_level = 3
    else if (Object.keys(feature.properties).includes("adm2_id")) admin_level = 2
    else if (Object.keys(feature.properties).includes("adm2_id")) admin_level = 1

    return admin_level
}
