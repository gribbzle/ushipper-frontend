const path = require('path');
const config = require('config');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { withSentryConfig } = require('@sentry/nextjs');

const uShipperConfig = {
    name: 'uShipper',
    productMapping: {
        dataField: 'vehicles',
        components: {
            orderItemProductsList: 'OrderItemVehiclesList',
            orderProductsFormPaper: 'OrderVehiclesFormPaper',
            orderProductsInfo: 'OrderVehiclesInfo',
            orderInspectionsPaper: 'OrderVehicleInspectionDetailsPaper',
            orderProductsMileCostTooltip: 'VehiclesMileCostTooltip',
            orderPaymentInfoFields: 'OrderUshipperPaymentInfoFields',
            loadboardItemProductsColumn: 'LoadboardItemVehiclesColumn',
            loadboardProductsDetailsBlock: 'VehiclesDetailsBlock',
            offerProductsDetailsDrawerBody: 'OfferVehiclesDetailsDrawerBody',
            offerItemProducts: 'OfferItemVehicles',
            orderBolProductsDetails: 'OrderBolVehiclesDetails',
            orderBolProductsInspections: 'OrderBolVehiclesInspections',
        },
    },
};

const freightXConfig = {
    name: 'FreightX',
    productMapping: {
        dataField: 'commodities',
        components: {
            orderItemProductsList: 'OrderItemCommoditiesList',
            orderProductsFormPaper: 'OrderCommoditiesFormPaper',
            orderProductsInfo: 'OrderCommoditiesInfo',
            orderInspectionsPaper: 'OrderCommodityInspectionDetailsPaper',
            orderProductsMileCostTooltip: 'CommoditiesMileCostTooltip',
            orderPaymentInfoFields: 'OrderFreightxPaymentInfoFields',
            loadboardItemProductsColumn: 'LoadboardItemCommoditiesColumn',
            loadboardProductsDetailsBlock: 'CommoditiesDetailsBlock',
            offerProductsDetailsDrawerBody: 'OfferCommoditiesDetailsDrawerBody',
            offerItemProducts: 'OfferItemCommodities',
            orderBolProductsDetails: 'OrderBolCommoditiesDetails',
            orderBolProductsInspections: 'OrderBolCommoditiesInspections',
        },
    },
};

const projectName = process.env.PROJECT_NAME || 'ushipper';
const projectConfig = projectName === 'freightx' ? freightXConfig : uShipperConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        pusherScheme: process.env.PUSHER_SCHEME,
        pusherHost: process.env.PUSHER_HOST,
        pusherAppKey: process.env.PUSHER_APP_KEY,
        pusherPort: process.env.PUSHER_PORT,
        pusherAppCluster: process.env.PUSHER_APP_CLUSTER,
        mapboxToken: process.env.MAPBOX_TOKEN,
        projectName: projectName,
        SENTRY_DSN: process.env.SENTRY_DSN,
    },
    reactStrictMode: true,
    serverRuntimeConfig: config.get('server'),
    publicRuntimeConfig: {
        ...config.get('client'),
        projectName: projectConfig.name,
        productMapping: projectConfig.productMapping,
    },
    images: {
        domains: [],
    },
    swcMinify: true,
    webpack(config, { dev }) {
        // TURN FCKNG OFF THE CSS MODULES
        config.module.rules.forEach(rule => {
            const { oneOf } = rule;

            if (oneOf) {
                oneOf.forEach(one => {
                    if (!`${one.issuer?.and}`.includes('_app')) return;
                    one.issuer.and = [path.resolve(__dirname)];
                });
            }
        });

        // Configurate configs for client side
        config.resolve.alias.config$ = require.resolve('./config/config-plugin.js');

        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        config.module.rules.push({
            test: /\.(ogg|mp3||mpe?g)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                    },
                },
            ],
        });

        if (dev) {
            // stylelint is slow in dev
            // config.plugins.push(new StylelintPlugin());
        } else {
            config.plugins.push(new StylelintPlugin());
        }

        return config;
    },
};

const sentryWebpackPluginOptions = {
    org: 'gribbzle',
    project: `${projectName}-frontend`,
    silent: true,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
        enabled: false,
    },
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false,
    injectSentryVersion: false,
};

module.exports = process.env.NODE_ENV === 'production'
    ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
    : nextConfig;
